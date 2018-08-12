'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (search) {
  return _qs2.default.parse(search, { decoder: decoder });
};

var decoder = function decoder(str, decode) {
  return isNumber(str) ? parseFloat(str) : decode(str);
};

var isNumber = function isNumber(str) {
  return !isNaN(str) && !isNaN(parseFloat(str));
};