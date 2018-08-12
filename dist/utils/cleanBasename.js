'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var bn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return !bn ? '' : stripTrailingSlash(addLeadingSlash(bn));
};

var addLeadingSlash = function addLeadingSlash(bn) {
  return bn.charAt(0) === '/' ? bn : '/' + bn;
};

var stripTrailingSlash = function stripTrailingSlash(bn) {
  return bn.charAt(bn.length - 1) === '/' ? bn.slice(0, -1) : bn;
};