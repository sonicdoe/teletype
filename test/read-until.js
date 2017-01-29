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

test('returns matched line', t => {
  const client = teletype(t.context.host, t.context.port)

  return client.readUntil(/hello/i).then(response => {
    t.is(response, 'Hello, world!')
  })
})

test('times out', async t => {
  const client = teletype(t.context.host, t.context.port)
  await client._lazyConnect()
  client.timeout = 1

  const error = await t.throws(client.readUntil(/qux/i))
  t.is(error.code, 'ETIMEDOUT')
})

test('rejects a TypeError if match is not a RegExp', t => {
  const client = teletype(t.context.host, t.context.port)
  t.throws(client.readUntil(23), TypeError)
})
