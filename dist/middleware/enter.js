'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (api) {
  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, next) {
      var res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!req.route.redirect) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', (0, _utils.redirectShortcut)(req));

            case 2:
              res = req.enter(); // commit history + action to state

              // return early on `load` so rendering can happen ASAP
              // i.e. before `thunk` is called but after potentially async auth in `beforeEnter`

              if (!(req.getKind() === 'load' && !(0, _utils.isServer)() && api.resolveFirstRouteOnEnter)) {
                _context.next = 7;
                break;
              }

              setTimeout(function () {
                next().then(function () {
                  req.ctx.busy = false;
                });
              }, 0); // insure callbacks like `onEnter` are called after `ReactDOM.render`, which should immediately be called after dispatching `firstRoute()`

              // in `createRouter.js` this flag will indicate to keep the pipeline still "busy" so
              // that dispatches in `thunk` and other callbacks after `enter` are treated as redirects,
              // as automatically happens throughout the pipeline. It becomes unbusy in the timeout above.
              req.clientLoadBusy = true;
              return _context.abrupt('return', res);

            case 7:
              return _context.abrupt('return', res.then(next).then(function () {
                return res;
              }));

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};