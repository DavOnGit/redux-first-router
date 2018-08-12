'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _History2 = require('./History');

var _History3 = _interopRequireDefault(_History2);

var _utils = require('./utils');

var _utils2 = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Even though this is used primarily in environments without `window` (server + React Native),
// it's also used as a fallback in browsers lacking the `history` API (<=IE9). In that now rare case,
// the URL won't change once you enter the site, however, if you forward or back out of the site
// we restore entries from `sessionStorage`. So essentially the application behavior is identical
// to browsers with `history` except the URL doesn't change.

// `initialEntries` can be:
// [path, path, etc] or: path
// [action, action, etc] or: action
// [[path, state, key?], [path, state, key?], etc] or: [path, state, key?]
// or any combination of different kinds

var MemoryHistory = function (_History) {
  _inherits(MemoryHistory, _History);

  function MemoryHistory() {
    _classCallCheck(this, MemoryHistory);

    return _possibleConstructorReturn(this, (MemoryHistory.__proto__ || Object.getPrototypeOf(MemoryHistory)).apply(this, arguments));
  }

  _createClass(MemoryHistory, [{
    key: '_restore',
    value: function _restore() {
      var opts = this.options;
      var i = opts.initialIndex,
          ents = opts.initialEntries,
          n = opts.initialN;

      var useSession = (0, _utils.supportsSession)() && opts.testBrowser !== false;

      opts.restore = opts.restore || useSession && _utils.restoreHistory;
      opts.save = opts.save || useSession && _utils.saveHistory;

      return opts.restore ? opts.restore(this) : (0, _utils2.toEntries)(this, ents, i, n); // when used as a browser fallback, we restore from sessionStorage
    }
  }]);

  return MemoryHistory;
}(_History3.default);

exports.default = MemoryHistory;