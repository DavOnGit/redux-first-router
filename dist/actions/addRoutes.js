'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('../types');

exports.default = function (routes, formatRoute) {
  return {
    type: _types.ADD_ROUTES,
    payload: { routes: routes, formatRoute: formatRoute }
  };
};

// NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute