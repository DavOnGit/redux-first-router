'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _resolvePathname = require('resolve-pathname');

var _resolvePathname2 = _interopRequireDefault(_resolvePathname);

var _utils = require('../../utils');

var _urlToAction = require('../../utils/urlToAction');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (to, routes) {
  var basename = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var currentPathname = arguments[3];
  var options = arguments[4];
  var basenames = options.basenames;

  var url = '';
  var action = void 0;

  if (!to) {
    url = '#';
  }
  if (to && typeof to === 'string') {
    url = to;
  } else if (Array.isArray(to)) {
    if (to[0].charAt(0) === '/') {
      basename = to.shift();
    }

    url = '/' + to.join('/');
  } else if ((typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object') {
    action = to;

    try {
      url = (0, _utils.actionToUrl)(action, { routes: routes, options: options });
      basename = action.basename || basename || '';
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[rudy/Link] could not create path from action:', action);
      }

      url = '#';
    }
  }

  var bn = basenames && (0, _urlToAction.findBasename)(url, basenames);

  if (bn) {
    basename = bn;
    url = (0, _urlToAction.stripBasename)(url, bn);
  }

  if (url.charAt(0) === '#') {
    url = '' + currentPathname + url;
  } else if (url.charAt(0) !== '/') {
    url = (0, _resolvePathname2.default)(url, currentPathname);
  }

  var isExternal = url.indexOf('http') === 0;

  if (!action && !isExternal) {
    var api = { routes: routes, options: options };
    action = (0, _utils.toAction)(api, url);
  }

  if (basename) {
    action = { ...action, basename: basename };
  }

  var fullUrl = isExternal ? url : basename + url;
  return { fullUrl: fullUrl, action: action };
};