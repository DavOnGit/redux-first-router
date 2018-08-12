'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BrowserHistory = require('../history/BrowserHistory');

var _BrowserHistory2 = _interopRequireDefault(_BrowserHistory);

var _MemoryHistory = require('../history/MemoryHistory');

var _MemoryHistory2 = _interopRequireDefault(_MemoryHistory);

var _utils = require('../history/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (routes) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (0, _utils.supportsDom)() && (0, _utils.supportsHistory)() && opts.testBrowser !== false ? new _BrowserHistory2.default(routes, opts) : new _MemoryHistory2.default(routes, opts);
};