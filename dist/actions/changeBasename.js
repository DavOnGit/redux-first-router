'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('../types');

exports.default = function (basename, action) {
  if (!action) {
    return {
      type: _types.CHANGE_BASENAME,
      payload: { basename: basename }
    };
  }

  return { ...action, basename: basename };
};

// NOTE: the first form with type `CHANGE_BASENAME` will trigger the pathlessRoute middleware
// see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute