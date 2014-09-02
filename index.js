'use strict';

var Stenograph = require('stenograph');
var onFinished = require('on-finished');

exports.onFinished = onFinished;

exports.register = function (plugin, options, next) {

  var steno = exports.steno = Stenograph.getInstance();

  plugin.ext('onRequest', function (request, next) {

    steno.startTransaction('hapi-request', {
      state: {
        type: 'http-server-request',
        req: request.raw.req,
        res: request.raw.res
      },
      transaction: function (end) {
        steno.bindEmitters(request.raw.req, request.raw.res);
        exports.onFinished(request.raw.res, end);
        next();
      }
    });
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
