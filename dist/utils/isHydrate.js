'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index');

exports.default = function (req) {
  var _req$getLocation = req.getLocation(),
      universal = _req$getLocation.universal;

  return universal && !(0, _index.isServer)() && req.getKind() === 'load';
};