'use strict'

class Teletype {
  constructor (host, port = 23) {
    if (typeof host !== 'string') {
      throw new TypeError('host must be a string.')
    }

    this.host = host
    this.port = port
  }
}

module.exports = (...args) => {
  return new Teletype(...args)
}
