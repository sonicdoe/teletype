'use strict'

const net = require('net')

// “The Telnet protocol defines the sequence CR LF to mean "end-of-line".”
// See https://tools.ietf.org/html/rfc1123#page-21.
const TELNET_EOL = '\r\n'

class Teletype {
  constructor (host, port, options) {
    if (!port) port = 23
    options = Object.assign({}, { timeout: false }, options)

    if (typeof host !== 'string') {
      throw new TypeError('host must be a string.')
    }

    if (typeof port !== 'number') {
      throw new TypeError('port must be a number.')
    }

    if (typeof options.timeout !== 'number' && options.timeout !== false) {
      throw new TypeError('options.timeout must be a number or false.')
    }

    this.host = host
    this.port = port
    this.timeout = options.timeout
  }

  _lazyConnect () {
    return new Promise((resolve, reject) => {
      let timeout

      if (this._client && !this._client.connecting) {
        return resolve(this._client)
      }

      if (!this._client) {
        this._client = net.connect({
          host: this.host,
          port: this.port
        })

        if (this.timeout) {
          timeout = setTimeout(() => {
            this._client.destroy()
            reject(errorTimedOut('Could not connect in time.'))
          }, this.timeout)
        }

        // “The TELNET protocol is based upon the notion of a virtual teletype,
        // employing a 7-bit ASCII character set.”
        // See https://tools.ietf.org/html/rfc206#page-2.
        this._client.setEncoding('ascii')
      }

      this._client.once('error', (err) => {
        if (timeout) clearTimeout(timeout)
        reject(err)
      })

      this._client.once('connect', () => {
        this._client.removeListener('error', reject)
        if (timeout) clearTimeout(timeout)
        resolve(this._client)
      })
    })
  }

  exec (command, match) {
    if (typeof command !== 'string') {
      return Promise.reject(new TypeError('command must be a string.'))
    }

    return this._lazyConnect().then(client => {
      let promise

      if (match) {
        promise = this.readUntil(match)
      }

      client.write(command + TELNET_EOL)

      if (match) return promise
    })
  }

  readUntil (match) {
    if (!(match instanceof RegExp)) {
      return Promise.reject(new TypeError('match must be a RegExp.'))
    }

    return this._lazyConnect().then(client => {
      return new Promise((resolve, reject) => {
        let timeout

        const onData = data => {
          const lines = data.split(TELNET_EOL)

          for (const line of lines) {
            if (match.test(line)) {
              resolve(line)
              client.removeListener('data', onData)
              if (timeout) clearTimeout(timeout)
              break
            }
          }
        }

        client.on('data', onData)

        if (this.timeout) {
          timeout = setTimeout(() => {
            reject(errorTimedOut('Did not receive matching data in time.'))
          }, this.timeout)
        }
      })
    })
  }

  close () {
    return this._lazyConnect().then(client => {
      client.end()
      client.destroy()
    })
  }
}

function errorTimedOut (message) {
  const err = new Error(message)
  err.code = 'ETIMEDOUT'
  return err
}

module.exports = (host, port, options) => {
  return new Teletype(host, port, options)
}
