# Teletype

[![Node.js package](https://img.shields.io/npm/v/teletype.svg)](https://www.npmjs.com/package/teletype)
[![Build status](https://img.shields.io/travis/sonicdoe/teletype.svg)](https://travis-ci.org/sonicdoe/teletype)

> A simple Telnet client.

## Installation

```sh
$ npm install teletype --save
```

## Usage

```js
const teletype = require('teletype')
const client = teletype('localhost')

client.exec('?PWR', /PWR[01]/)
  .then(response => {
    console.log(response) // PWR0
  })
```

### API

#### teletype(host[, port, options])

Creates a Teletype client.

##### host

Type: `String`

The hostname or IP address of the host to connect to.

##### port

Type: `Number`  
Default: `23`

The port to connect to.

##### options

Type: `Object`

###### timeout

Type: `Number` or `false`  
Default: `false`

The number of milliseconds before a call is considered to be timed out. This
applies to the initial connection, `readUntil()`, and `exec()` if called with
`match`. `exec()` without `match` and `close()` will never time out.

#### client.exec(command[, match])

Sends a command to the host and reads incoming data until `match` is
encountered. If `match` is given, it returns a promise for a `response` string
which contains the first line where `match` was encountered.

##### command

Type: `String`

The command to send to the host.

##### match

Type: `RegExp`

The regular expression to match against incoming data. If omitted, Teletype
won’t read any incoming data but will send the command to the host.

#### client.readUntil(match)

Reads incoming data from the host until `match` is encountered. Returns a
promise for a `response` string which contains the first line where `match`
was encountered.

#### client.close()

[Sends a FIN packet](https://nodejs.org/dist/latest-v6.x/docs/api/net.html#net_socket_end_data_encoding)
and
[destroys the socket](https://nodejs.org/dist/latest-v6.x/docs/api/net.html#net_socket_destroy_exception).

### Errors

If a required argument is missing, Teletype will reject a `TypeError`.
If a call times out, it will reject an error with the code `ETIMEDOUT`.
Any other error will be the same as emitted by
[Node.js’s `net`](https://nodejs.org/dist/latest-v6.x/docs/api/net.html#net_event_error_1).

## Acknowledgments

Teletype is inspired by [Ruby’s `Net::Telnet`](https://github.com/ruby/net-telnet)
and [Python’s `telnetlib`](https://docs.python.org/3.6/library/telnetlib.html).

If you need something more advanced, take a look at
[`telnet-client`](https://github.com/mkozjak/node-telnet-client).

## License

Teletype itself is licensed under the ISC license. See [`LICENSE`](./LICENSE)
for the full license.
