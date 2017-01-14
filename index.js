'use strict'

const net = require('net')

// “The Telnet protocol defines the sequence CR LF to mean "end-of-line".”
// See https://tools.ietf.org/html/rfc1123#page-21.
const TELNET_EOL = '\r\n'

class Teletype {
  constructor (host, port = 23) {
    if (typeof host !== 'string') {
      throw new TypeError('host must be a string.')
    }

    if (typeof port !== 'number') {
      throw new TypeError('port must be a number.')
    }

    this.host = host
    this.port = port
  }

  _lazyConnect () {
    return new Promise((resolve, reject) => {
      if (this._client && !this._client.connecting) {
        return resolve(this._client)
      }

      if (!this._client) {
        const { host, port } = this
        this._client = net.connect({ host, port })

        // “The TELNET protocol is based upon the notion of a virtual teletype,
        // employing a 7-bit ASCII character set.”
        // See https://tools.ietf.org/html/rfc206#page-2.
        this._client.setEncoding('ascii')
      }

      this._client.once('error', reject)

      this._client.once('connect', () => {
        this._client.removeListener('error', reject)
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
        const client = this._client

        const onData = data => {
          const lines = data.split(TELNET_EOL)

          for (const line of lines) {
            if (match.test(line)) {
              resolve(line)
              client.removeListener('data', onData)
              break
            }
          }
        }

        client.on('data', onData)
      })
    })
  }
}

module.exports = (...args) => {
  return new Teletype(...args)
}
