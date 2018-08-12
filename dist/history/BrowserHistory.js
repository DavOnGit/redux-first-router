'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _History2 = require('./History');

var _History3 = _interopRequireDefault(_History2);

var _utils = require('../utils');

var _utils2 = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 1) HISTORY RESTORATION:
// * FROM SESSION_STORAGE (WITH A FALLBACK TO OUR "HISTORY_STORAGE" SOLUTION)

// The `id` below is very important, as it's used to identify unique `sessionStorage` sessions lol.

// Essentially, you can have multiple tabs open, or even in the same tab multiple sessions if you
// enter another URL at the same site manually. Each need their history entries independently tracked.

// So we:
// - create an `id` for each when first encountered
// - store it in `this.state.id`
// - and prefix their `sessionStorage` key with it to uniquely identify the different histories :)

// - then we restore the history using the id
// - and for all subsequent history saving, we save to the correct storage with that `id`

// NOTE: As far as the "HISTORY_STORAGE" fallback goes, please `sessionStorage.js`.
// Essentially we save the entire sessionStorage in every entry of `window.history` :)

// 2) POP HANDLING -- THE MOST IMPORTANT THING HERE:

// A) REVERT POP: `forceGo(currentIndex - index)`
// The first executed `forceGo` automatically undos the pop event, putting the browser history
// back to where it was. Since the `jump` function takes relative numbers, we must calculate
// that number by subtracting the current index from the next index

// B) COMMIT POP: `forceGo(index - currentIndex)`
// similarly the `commit` function performed in client code performs the reverse operation

// EXAMPLE:
// User presses back from index 5 to 4
// revert: 5 - 4 === jump(1)
// commit: 4 - 5 === jump(-1)
// :)

// WHY?
// so client code can control when the URL actually changes, and possibly deny it

var BrowserHistory = function (_History) {
  _inherits(BrowserHistory, _History);

  function BrowserHistory() {
    _classCallCheck(this, BrowserHistory);

    return _possibleConstructorReturn(this, (BrowserHistory.__proto__ || Object.getPrototypeOf(BrowserHistory)).apply(this, arguments));
  }

  _createClass(BrowserHistory, [{
    key: '_restore',
    value: function _restore() {
      this.options.restore = this.options.restore || _utils2.restoreHistory;
      this.options.save = this.options.save || _utils2.saveHistory;

      this._setupPopHandling();

      return this.options.restore(this);
    }
  }, {
    key: 'listen',
    value: function listen(dispatch, getLocation) {
      var _this2 = this;

      if (!this.dispatch) {
        // we don't allow/need multiple listeners currently
        _get(BrowserHistory.prototype.__proto__ || Object.getPrototypeOf(BrowserHistory.prototype), 'listen', this).call(this, dispatch, getLocation);
        this._addPopListener();
      }

      return function () {
        return _this2.unlisten();
      };
    }
  }, {
    key: 'unlisten',
    value: function unlisten() {
      this._removePopListener();
      _get(BrowserHistory.prototype.__proto__ || Object.getPrototypeOf(BrowserHistory.prototype), 'unlisten', this).call(this);
    }
  }, {
    key: '_didPopForward',
    value: function _didPopForward(url) {
      var e = this.entries[this.index + 1];
      return e && e.location.url === url;
    }
  }, {
    key: '_setupPopHandling',
    value: function _setupPopHandling() {
      var _this3 = this;

      var handlePop = function handlePop() {
        if (_this3._popForced) return _this3._popForced = false;

        var _window$location = window.location,
            pathname = _window$location.pathname,
            search = _window$location.search,
            hash = _window$location.hash;

        var url = pathname + search + hash;

        var n = void 0;

        if (!_this3.pendingPop) {
          n = _this3._didPopForward(url) ? 1 : -1;
          _this3.pendingPop = n;
        } else if (url === _this3.url) {
          n = _this3.pendingPop * -1; // switch directions
          return _this3._forceGo(n * -1);
        } else {
          n = _this3.pendingPop;
          return _this3._forceGo(n * -1);
        }

        var reverted = false;

        var revertPop = function revertPop() {
          if (!reverted) _this3._forceGo(n * -1);
          reverted = true;
        };

        // revertPop will be called if route change blocked by `core/compose.js` or used as
        // a flag by `this._jump` below to do nothing in the browser, since the user already
        // did it via browser back/next buttons
        _this3.currentPop = _this3.jump(n, false, n, null, true, revertPop); // `currentPop` used only by tests to await browser-initiated pops
      };

      var onPopState = function onPopState(e) {
        return !(0, _utils2.isExtraneousPopEvent)(e) && handlePop();
      }; // ignore extraneous popstate events in WebKit
      var onHashChange = handlePop;

      this._addPopListener = function () {
        return (0, _utils2.addPopListener)(onPopState, onHashChange);
      };
      this._removePopListener = function () {
        return (0, _utils2.removePopListener)(onPopState, onHashChange);
      };
    }
  }, {
    key: '_forceGo',
    value: function _forceGo(n) {
      this._popForced = true;
      window.history.go(n); // revert
      return Promise.resolve();
    }
  }, {
    key: '_push',
    value: function _push(action, awaitUrl) {
      var url = action.location.url;


      return this._awaitUrl(awaitUrl, '_push').then(function () {
        return (0, _utils2.pushState)(url);
      });
    }
  }, {
    key: '_replace',
    value: function _replace(action, awaitUrl, n) {
      var url = action.location.url;


      if (n) {
        this._forceGo(n);

        return this._awaitUrl(awaitUrl, '_replaceBackNext').then(function () {
          return (0, _utils2.replaceState)(url);
        });
      }

      if (this.location.kind === 'load') {
        awaitUrl = (0, _utils.locationToUrl)(window.location); // special case: redirects on load have no previous URL
      }

      return this._awaitUrl(awaitUrl, '_replace').then(function () {
        return (0, _utils2.replaceState)(url);
      });
    }
  }, {
    key: '_jump',
    value: function _jump(action, currUrl, oldUrl, n, isPop) {
      var _this4 = this;

      if (!n) {
        // possibly the user mathematically calculated a jump of `0`
        return this._replace(action, currUrl);
      }

      if (isPop) return; // pop already handled by browser back/next buttons and real history state is already up to date

      return this._awaitUrl(currUrl, 'jump prev').then(function () {
        return _this4._forceGo(n);
      }).then(function () {
        return _this4._awaitUrl(oldUrl, 'jump loc');
      }).then(function () {
        return _this4._replace(action, oldUrl);
      });
    }
  }, {
    key: '_set',
    value: function _set(action, oldUrl, n) {
      var _this5 = this;

      if (!n) {
        return this._replace(action, oldUrl);
      }

      var _action$location = action.location,
          index = _action$location.index,
          entries = _action$location.entries;

      var changedAction = entries[index + n];

      return this._awaitUrl(action, '_setN start').then(function () {
        return _this5._forceGo(n);
      }).then(function () {
        return _this5._awaitUrl(oldUrl, '_setN before replace');
      }).then(function () {
        return _this5._replace(changedAction, oldUrl);
      }).then(function () {
        return _this5._forceGo(-n);
      }).then(function () {
        return _this5._awaitUrl(action, 'setN return');
      });
    }
  }, {
    key: '_reset',
    value: function _reset(action, oldUrl, oldFirstUrl, reverseN) {
      var _this6 = this;

      var _action$location2 = action.location,
          index = _action$location2.index,
          entries = _action$location2.entries;

      var lastIndex = entries.length - 1;
      var reverseDeltaToIndex = index - lastIndex;
      var indexUrl = entries[index].location.url;

      return this._awaitUrl(oldUrl, 'reset oldUrl').then(function () {
        return _this6._forceGo(reverseN);
      }).then(function () {
        return _this6._awaitUrl(oldFirstUrl, 'reset oldFirstUrl');
      }).then(function () {
        (0, _utils2.replaceState)(entries[0].location.url); // we always insure resets have at least 2 entries, and the first can only operate via `replaceState`
        entries.slice(1).forEach(function (e) {
          return (0, _utils2.pushState)(e.location.url);
        }); // we have to push at least one entry to erase the old entries in the real browser history

        if (reverseDeltaToIndex) {
          return _this6._forceGo(reverseDeltaToIndex).then(function () {
            return _this6._awaitUrl(indexUrl, 'resetIndex _forceGo');
          });
        }
      });
    }
  }, {
    key: '_awaitUrl',
    value: function _awaitUrl(actOrUrl, name) {
      var _this7 = this;

      return new Promise(function (resolve) {
        var url = typeof actOrUrl === 'string' ? actOrUrl : actOrUrl.location.url;
        var ready = function ready() {
          console.log('ready', url, (0, _utils.locationToUrl)(window.location));
          return url === (0, _utils.locationToUrl)(window.location);
        };
        return tryChange(ready, resolve, name, _this7); // TODO: is the this supposed to be there, its one extra param over
      });
    }
  }]);

  return BrowserHistory;
}(_History3.default);

// CHROME WORKAROUND:
// chrome doesn't like rapid back to back history changes, so we test the first
// change happened first, before executing the next

exports.default = BrowserHistory;
var tries = 0;
var maxTries = 10;
var queue = [];

var tryChange = function tryChange(ready, complete, name) {
  if (tries === 0) rapidChangeWorkaround(ready, complete, name);else queue.push([ready, complete, name]);
};

var rapidChangeWorkaround = function rapidChangeWorkaround(ready, complete, name) {
  tries++;

  if (!ready() && tries < maxTries) {
    console.log('tries', tries + 1, name);
    setTimeout(function () {
      return rapidChangeWorkaround(ready, complete, name);
    }, 9);
  } else {
    if (process.env.NODE_ENV === 'test' && !ready()) {
      throw new Error('BrowserHistory.rapidChangeWorkAround failed to be "ready"');
    }

    complete();
    tries = 0;

    var _ref = queue.shift() || [],
        _ref2 = _slicedToArray(_ref, 3),
        again = _ref2[0],
        com = _ref2[1],
        _name = _ref2[2]; // try another if queue is full

    if (again) {
      rapidChangeWorkaround(again, com, _name);
    }
  }
};