'use strict'

import test from 'ava'
import teletype from '..'

test('creates an instance of Teletype', t => {
  const client = teletype('localhost', 23)
  t.is(client.constructor.name, 'Teletype')
})

test('sets host', t => {
  const client = teletype('::1', 23)
  t.is(client.host, '::1')
})

test('sets port', t => {
  const client = teletype('localhost', 2323)
  t.is(client.port, 2323)
})

test('defaults to port 23', t => {
  const client = teletype('localhost')
  t.is(client.port, 23)
})

test('throws a TypeError if host is not a string', t => {
  t.throws(() => {
    teletype(23, 23)
  }, TypeError)
})

test('throws a TypeError if port is not a number', t => {
  t.throws(() => {
    teletype('localhost', 'localhost')
  }, TypeError)
})
