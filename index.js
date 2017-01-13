'use strict'

const net = require('net')

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
      const { host, port } = this
      this._client = net.connect({ host, port })

      this._client.once('error', reject)

      this._client.once('connect', () => {
        this._client.removeListener('error', reject)
        resolve(this._client)
      })
    })
  }
}

module.exports = (...args) => {
  return new Teletype(...args)
}
