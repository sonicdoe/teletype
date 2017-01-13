'use strict'

const net = require('net')

module.exports = () => {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.listen(0)

    server.once('listening', () => {
      resolve(server)
    })
  })
}
