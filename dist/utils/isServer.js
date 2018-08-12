'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return !(typeof window !== 'undefined' && window.document && window.document.createElement);
};