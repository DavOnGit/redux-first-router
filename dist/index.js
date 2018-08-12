'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createRouter = require('./core/createRouter');

Object.defineProperty(exports, 'createRouter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createRouter).default;
  }
});

var _createScene = require('./createScene');

Object.defineProperty(exports, 'createScene', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createScene).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }