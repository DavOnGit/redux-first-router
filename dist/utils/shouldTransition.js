'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('../types');

exports.default = function (action, _ref) {
  var routes = _ref.routes;
  var _action$type = action.type,
      type = _action$type === undefined ? '' : _action$type;

  var route = routes[type];

  return route || type.indexOf(_types.PREFIX) > -1;
};