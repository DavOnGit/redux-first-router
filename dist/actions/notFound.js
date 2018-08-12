'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (state, type) {
  return {
    type: type || 'NOT_FOUND', // type not meant for user to supply; it's passed by generated action creators
    state: state
  };
};