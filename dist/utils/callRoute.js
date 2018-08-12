'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (routes) {
  return function (action, key) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var type = typeof action === 'string' ? action : action.type;
    var route = routes[type];
    if (!route) return null;

    if (!key) return route;
    if (typeof route[key] !== 'function') return route[key];

    action = (typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object' ? action : { type: type };
    return route[key].apply(route, [action].concat(args));
  };
};

// usage:
// callRoute(routes)(action, key, ...args)