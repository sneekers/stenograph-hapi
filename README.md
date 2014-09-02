# Stenograph Hapi [![travis](https://img.shields.io/travis/sneekers/stenograph-hapi.svg)](https://travis-ci.org/sneekers/stenograph-hapi) [![npm](https://img.shields.io/npm/v/stenograph-hapi.svg)](https://npmjs.org/package/stenograph-hapi)

A simple module that creates a transaction on every request, which paired with [Stenograph](https://www.github.com/sneekers/stenograph)
`onStart`/`onEnd` transaction listeners, can track every server request.

## Install
```sh
npm install stenograph-hapi
```

## API

```js
var Hapi = require('hapi');

var server = Hapi.createServer();

server.pack.register(require('stenograph-hapi'), function (err) {
  console.log(err);
});
```
