'use strict'

import test from 'ava'
import createServer from './helpers/server'
import teletype from '..'

const TELNET_EOL = '\r\n'

test.beforeEach(t => {
  return createServer().then(server => {
    t.context.server = server
    t.context.host = server.address().address
    t.context.port = server.address().port
  })
})

test.cb('sends command to server', t => {
  const client = teletype(t.context.host, t.context.port)

  t.context.server.once('connection', c => {
    c.on('data', data => {
      t.is(data, 'echo foo' + TELNET_EOL)
      t.end()
    })
  })

  client.exec('echo foo')
})

test('returns matched line', t => {
  const client = teletype(t.context.host, t.context.port)

  return client.exec('echo foo', /foo/).then(response => {
    t.is(response, 'foo')
  })
})

test('rejects a TypeError if command is not a string', t => {
  const client = teletype(t.context.host, t.context.port)
  t.throws(client.exec(23), TypeError)
})
