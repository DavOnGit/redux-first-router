'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('../types');

exports.default = function (invalidator, options) {
  return {
    type: _types.CLEAR_CACHE,
    payload: { invalidator: invalidator, options: options }
  };
};

// NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute