'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

// TODO: Assess and add better flow annotations
exports.default = function (name, selector) {
  if (typeof selector === 'function') {
    return selector;
  }
  if (selector) {
    return function (state) {
      return state[selector];
    };
  }
  return function (state) {
    return state[name];
  };
};