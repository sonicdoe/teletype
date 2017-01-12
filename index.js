'use strict'

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
}

module.exports = (...args) => {
  return new Teletype(...args)
}
