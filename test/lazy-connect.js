'use strict'

import test from 'ava'
import createServer from './helpers/server'
import teletype from '..'

test.beforeEach(t => {
  return createServer().then(server => {
    t.context.server = server
    t.context.host = server.address().address
    t.context.port = server.address().port
  })
})

test.cb('connects to host', t => {
  const client = teletype(t.context.host, t.context.port)
  t.context.server.once('connection', () => t.end())
  client._lazyConnect()
})

test('resolves socket', t => {
  const client = teletype(t.context.host, t.context.port)

  return client._lazyConnect(client => {
    t.is(client.constructor.name, 'Socket')
  })
})

test('assigns socket to _client property', t => {
  const client = teletype(t.context.host, t.context.port)

  return client._lazyConnect(() => {
    t.is(client._client.constructor.name, 'Socket')
  })
})

test('passes on any errors', t => {
  const client = teletype('teletype.invalid')
  t.throws(client._lazyConnect(), /ENOTFOUND/)
})
