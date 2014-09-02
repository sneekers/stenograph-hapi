/*jshint expr: true*/
'use strict';

var Lab = require('lab');
var expect = require('chai').expect;

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
var afterEach = lab.afterEach;
var it = lab.it;

var Stenograph = require('stenograph');
var Hapi = require('hapi');

describe('register', function () {

  var getInstance;
  var steno;
  var stenoHapi;
  var server;
  before(function (done) {
    getInstance = Stenograph.getInstance;
    steno = new Stenograph();
    Stenograph.getInstance = function () {
      return steno;
    };

    server = Hapi.createServer('localhost', 8000);

    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply('foo');
      }
    });

    stenoHapi = require('../');
    server.pack.register(stenoHapi, function (err) {
      done(err);
    });
  });

  after(function (done) {
    Stenograph.getInstance = getInstance;
    done();
  });

  var startTransaction;
  var onFinished;
  beforeEach(function (done) {
    startTransaction = steno.startTransaction;
    onFinished = stenoHapi.onFinished;
    done();
  });

  afterEach(function (done) {
    steno.startTransaction = startTransaction;
    stenoHapi.onFinished = onFinished;
    done();
  });

  it('listens to onRequest', function (done) {
    expect(server._ext._events.onRequest).to.not.be.null;
    done();
  });

  it('calls start transaction on each request', function (done) {
    steno.startTransaction = function (name, options) {
      expect(name).to.equal('hapi-request');
      expect(options.transaction).to.be.a.function;
      done();
    };

    server.inject('/', function () {});
  });

  it('passes in raw req and res on each request', function (done) {
    steno.startTransaction = function (name, options) {
      expect(options.state.req).to.exist;
      expect(options.state.res).to.exist;
      done();
    };

    server.inject('/', function () {});
  });

  it('calls onFinished inside the transaction', function (done) {
    var endFn = function () {};

    stenoHapi.onFinished = function (res, end) {
      expect(res).to.exist;
      expect(end).to.equal(endFn);
      done();
    };

    steno.startTransaction = function (name, options) {
      options.transaction(endFn);
    };

    server.inject('/', function () {});
  });

});
