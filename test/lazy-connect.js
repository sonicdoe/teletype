'use strict'

import test from 'ava'
import net from 'net'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import createServer from './helpers/server'
import teletype from '..'

const testSkipNode4 = (/^v4/.test(process.version) ? test.skip : test)

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

test('it only connects once', t => {
  const spy = sinon.spy(net.connect)

  const teletype = proxyquire('..', {
    net: {
      connect: spy
    }
  })

  const client = teletype(t.context.host, t.context.port)
  const promises = [client._lazyConnect(), client._lazyConnect()]

  return Promise.all(promises).then(() => {
    t.true(spy.calledOnce)
  })
})

// Skip test in Node.js v4 because socket.connecting is only available in
// Node.js v6.1.0 and later.
testSkipNode4('it only resolves when connected', t => {
  const client = teletype(t.context.host, t.context.port)
  const promises = [client._lazyConnect(), client._lazyConnect()]

  return Promise.race(promises).then(client => {
    t.is(client.connecting, false)
  })
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

test('times out', async t => {
  const client = teletype(t.context.host, t.context.port, { timeout: 1 })
  const error = await t.throws(client._lazyConnect())
  t.is(error.code, 'ETIMEDOUT')
})

test('passes on any errors', t => {
  const client = teletype('teletype.invalid')
  t.throws(client._lazyConnect(), /ENOTFOUND/)
})
