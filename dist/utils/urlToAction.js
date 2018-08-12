'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findBasename = exports.stripBasename = undefined;

var _resolvePathname = require('resolve-pathname');

var _resolvePathname2 = _interopRequireDefault(_resolvePathname);

var _index = require('./index');

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (api, url) {
  var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var key = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : createKey();
  var getLocation = api.getLocation,
      routes = api.routes,
      opts = api.options;

  var curr = getLocation ? getLocation() : {};

  var _resolveBasename = resolveBasename(url, opts, state, curr),
      basename = _resolveBasename.basename,
      slashBasename = _resolveBasename.slashBasename;

  var location = createLocation(url, opts, slashBasename, curr);
  var action = createAction(location, routes, opts, state, curr);

  return {
    ...action, // { type, params, query, state, hash }
    basename: basename,
    location: {
      key: key,
      scene: routes[action.type].scene || '',
      url: slashBasename + (0, _index.locationToUrl)(location),
      pathname: location.pathname,
      search: location.search
    }
  };
};

var createLocation = function createLocation(url, opts, bn, curr) {
  if (!url) {
    url = curr.pathname || '/';
  } else if (curr.pathname && url.charAt(0) !== '/') {
    url = (0, _resolvePathname2.default)(url, curr.pathname); // resolve pathname relative to current location
  } else {
    url = stripBasename(url, bn); // eg: /base/foo?a=b#bar -> /foo?a=b#bar
  }

  return (0, _index.urlToLocation)(url); // gets us: { pathname, search, hash } properly formatted
};

var createAction = function createAction(loc, routes, opts) {
  var st = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var curr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var types = Object.keys(routes).filter(function (type) {
    return routes[type].path;
  });

  for (var i = 0; i < types.length; i++) {
    var _type = types[i];
    var route = routes[_type];
    var transformers = { formatParams: formatParams, formatQuery: formatQuery, formatHash: formatHash };
    var match = (0, _index.matchUrl)(loc, route, transformers, route, opts);

    if (match) {
      var params = match.params,
          query = match.query,
          hash = match.hash;

      var state = formatState(st, route, opts);
      return { type: _type, params: params, query: query, hash: hash, state: state };
    }
  }

  var _ref = routes[curr.type] || {},
      scene = _ref.scene;

  // TODO: Need some clairfication on scene stuff
  // $FlowFixMe


  var type = routes[scene + '/NOT_FOUND'] && scene + '/NOT_FOUND'; // try to interpret scene-level NOT_FOUND if available (note: links create plain NOT_FOUND actions)

  return {
    ...(0, _actions.notFound)(st, type),
    params: {}, // we can't know these in this case
    query: loc.search ? parseSearch(loc.search, routes, opts) : {}, // keep this info
    hash: loc.hash || ''
  };
};

// EVERYTHING BELOW IS RELATED TO THE TRANSFORMERS PASSED TO `matchUrl`:

var formatParams = function formatParams(params, route, opts) {
  var from = route.fromPath || defaultFromPath;

  for (var key in params) {
    var val = params[key];
    var decodedVal = val && decodeURIComponent(val); // don't decode undefined values from optional params
    params[key] = from(decodedVal, key, val, route, opts);
    if (params[key] === undefined) delete params[key] === undefined; // allow optional params to be overriden by defaultParams
  }

  var def = route.defaultParams || opts.defaultParams;
  return def ? typeof def === 'function' ? def(params, route, opts) : { ...def, ...params } : params;
};

var defaultFromPath = function defaultFromPath(decodedVal, key, val, route, opts) {
  var convertNum = route.convertNumbers || opts.convertNumbers && route.convertNumbers !== false;

  if (convertNum && isNumber(decodedVal)) {
    return parseFloat(decodedVal);
  }

  var capitalize = route.capitalizedWords || opts.capitalizedWords && route.capitalizedWords !== false;

  if (capitalize) {
    return decodedVal.replace(/-/g, ' ').replace(/\b\w/g, function (ltr) {
      return ltr.toUpperCase();
    }); // 'my-category' -> 'My Category'
  }

  return opts.fromPath ? opts.fromPath(decodedVal, key, val, route, opts) : decodedVal;
};

var formatQuery = function formatQuery(query, route, opts) {
  // TODO: Is this fromPath ? its got the same props going into it?
  // $FlowFixMe
  var from = route.fromSearch || opts.fromSearch;

  if (from) {
    for (var key in query) {
      query[key] = from(query[key], key, route, opts);
      if (query[key] === undefined) delete query[key] === undefined; // allow undefined values to be overridden by defaultQuery
    }
  }

  var def = route.defaultQuery || opts.defaultQuery;
  return def ? typeof def === 'function' ? def(query, route, opts) : { ...def, ...query } : query;
};

var formatHash = function formatHash(hash, route, opts) {
  // TODO: is this toHash?
  // $FlowFixMe
  var from = route.fromHash || opts.fromHash;
  // $FlowFixMe
  hash = from ? from(hash, route, opts) : hash;

  var def = route.defaultHash || opts.defaultHash;
  return def ? typeof def === 'function' ? def(hash, route, opts) : hash || def : hash;
};

var formatState = function formatState(state, route, opts) {
  var def = route.defaultState || opts.defaultState;
  return def ? typeof def === 'function' ? def(state, route, opts) : { ...def, ...state } : state;
}; // state has no string counter part in the address bar, so there is no `fromState`

var isNumber = function isNumber(str) {
  return !isNaN(str) && !isNaN(parseFloat(str));
};

var parseSearch = function parseSearch(search, routes, opts) {
  return (routes.NOT_FOUND.parseSearch || opts.parseSearch)(search);
};

// BASENAME HANDLING:

var resolveBasename = function resolveBasename(url, opts, state, curr) {
  // TODO: Whats going on with this huge option type?
  // $FlowFixMe
  var bn = state._emptyBn ? '' : findBasename(url, opts.basenames) || curr.basename;

  var slashBasename = (0, _index.cleanBasename)(bn);
  var basename = slashBasename.replace(/^\//, ''); // eg: '/base' -> 'base'

  delete state._emptyBn; // not cool kyle

  return { basename: basename, slashBasename: slashBasename // { 'base', '/base' }
  };
};

var stripBasename = exports.stripBasename = function stripBasename(path, bn) {
  return path.indexOf(bn) === 0 ? path.substr(bn.length) : path;
};

var findBasename = exports.findBasename = function findBasename(path) {
  var bns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return bns.find(function (bn) {
    return path.indexOf(bn) === 0;
  });
};

// MISC

var createKey = function createKey() {
  if (process.env.NODE_ENV === 'test') {
    return '123456789'.toString(36).substr(2, 6);
  }
  return Math.random().toString(36).substr(2, 6);
};