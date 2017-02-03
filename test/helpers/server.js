'use strict'

import net from 'net'

const TELNET_EOL = '\r\n'

module.exports = () => {
  return new Promise((resolve, reject) => {
    const server = net.createServer(c => {
      c.setEncoding('ascii')
      c.write('Hello, world!' + TELNET_EOL)

      c.on('data', data => {
        if (/^echo /.test(data)) {
          const str = data.substring('echo '.length)
          c.write(str + TELNET_EOL)
        }
      })

      c.on('error', err => {
        // ECONNRESET is to be expected during `close` tests.
        if (err.code !== 'ECONNRESET') throw err
      })
    })

    server.listen(0)

    server.once('listening', () => {
      resolve(server)
    })
  })
}
