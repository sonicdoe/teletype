'use strict'

const net = require('net')

const TELNET_EOL = '\r\n'

module.exports = () => {
  return new Promise((resolve, reject) => {
    const server = net.createServer(c => {
      c.setEncoding('ascii')
      c.write('Hello, world!' + TELNET_EOL)
    })

    server.listen(0)

    server.once('listening', () => {
      resolve(server)
    })
  })
}
