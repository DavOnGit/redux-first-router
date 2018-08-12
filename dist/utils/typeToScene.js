'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (type) {
  var i = type.lastIndexOf('/');
  return type.substr(0, i);
};