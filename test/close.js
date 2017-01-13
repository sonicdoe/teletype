'use strict'

import test from 'ava'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

import createServer from './helpers/server'
import spyNet from './helpers/spy-net'

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create()

  return createServer().then(server => {
    t.context.server = server
    t.context.host = server.address().address
    t.context.port = server.address().port
  })
})

test.afterEach(t => {
  t.context.server.close()
  t.context.sandbox.restore()
})

test('calls net’s end()', t => {
  const { netStub, spyPromise } = spyNet(t.context.sandbox, 'end')
  const teletype = proxyquire('../', { net: netStub })
  const client = teletype(t.context.host, t.context.port)

  return client.close().then(() => {
    return spyPromise.then(spy => t.true(spy.called))
  })
})

test('calls net’s destroy()', t => {
  const { netStub, spyPromise } = spyNet(t.context.sandbox, 'destroy')
  const teletype = proxyquire('../', { net: netStub })
  const client = teletype(t.context.host, t.context.port)

  return client.close().then(() => {
    return spyPromise.then(spy => t.true(spy.called))
  })
})
