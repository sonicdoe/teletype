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
