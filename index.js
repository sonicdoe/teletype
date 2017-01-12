'use strict'

class Teletype {
  constructor (host, port = 23) {
    this.host = host
    this.port = port
  }
}

module.exports = (...args) => {
  return new Teletype(...args)
}
