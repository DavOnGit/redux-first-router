'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('../types');

exports.default = function () {
  var canLeave = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return {
    type: _types.CONFIRM,
    payload: { canLeave: canLeave }
  };
};

// NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute