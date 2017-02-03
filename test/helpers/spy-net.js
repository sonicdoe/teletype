'use strict'

import net from 'net'

module.exports = (sandbox, method) => {
  const netStub = {}

  const spyPromise = new Promise((resolve, reject) => {
    netStub.connect = (options) => {
      const socket = net.connect(options)
      const spy = sandbox.spy(socket, method)

      resolve(spy)
      return socket
    }
  })

  return { netStub, spyPromise }
}
