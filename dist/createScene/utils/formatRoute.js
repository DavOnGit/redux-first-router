'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

exports.default = function (r, type, routes, formatter) {
  var route = (0, _utils.formatRoute)(r, type, routes, formatter);

  route.scene = (0, _utils.typeToScene)(type);
  // set default path for NOT_FOUND actions if necessary
  if (!route.path && (0, _utils.isNotFound)(type)) {
    route.path = route.scene
    // $FlowFixMe
    ? '/' + r.scene.toLowerCase() + '/not-found' : '/not-found';
  }

  return route;
};