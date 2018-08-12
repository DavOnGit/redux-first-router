'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require('./index');

exports.default = function (action, api, prevRoute) {
  var routes = api.routes,
      opts = api.options;
  var type = action.type,
      params = action.params,
      query = action.query,
      state = action.state,
      hash = action.hash,
      basename = action.basename;


  var route = routes[type] || {};
  var path = (typeof route === 'undefined' ? 'undefined' : _typeof(route)) === 'object' ? route.path : route;

  var p = formatParams(params, route, opts);
  var q = formatQuery(query, route, opts);
  var s = formatState(state, route, opts);
  var h = formatHash(hash, route, opts);

  var bn = (0, _index.cleanBasename)(basename);
  var isWrongBasename = bn && !opts.basenames.includes(bn);
  // $FlowFixMe
  if (basename === '') s._emptyBn = true; // not cool kyle

  try {
    if (isWrongBasename) {
      throw new Error('[rudy] basename "' + bn + '" not in options.basenames');
    }

    var pathname = (0, _index.compileUrl)(path, p, q, h, route, opts) || '/'; // path-to-regexp throws for failed compilations; we made our queries + hashes also throw to conform
    var url = bn + pathname;

    return { url: url, state: s };
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[rudy] unable to compile action "' + type + '" to URL', action, e);
    } else if (process.env.NODE_ENV === 'test') {
      console.log('[rudy] unable to compile action "' + type + '" to URL', action, e);
    }

    var base = isWrongBasename ? '' : bn;
    var _url = base + notFoundUrl(action, routes, opts, q, h, prevRoute);
    return { url: _url, state: s };
  }
};

var formatParams = function formatParams(params, route, opts) {
  var def = route.defaultParams || opts.defaultParams;

  params = def ? typeof def === 'function' ? def(params, route, opts) : { ...def, ...params } : params;

  if (params) {
    var newParams = {};
    var to = route.toPath || defaultToPath;
    for (var key in params) {
      var val = params[key];
      var encodedVal = encodeURIComponent(val);

      var res = to(val, key, encodedVal, route, opts);
      newParams[key] = res;
    }
    return newParams;
  }
};

var defaultToPath = function defaultToPath(val, key, encodedVal, route, opts) {
  if (typeof val === 'string' && val.indexOf('/') > -1) {
    // support a parameter that for example is a file path with slashes (like on github)
    return val.split('/').map(encodeURIComponent); // path-to-regexp supports arrays for this use case
  }

  if (typeof val === 'string' && val.indexOf('/') > -1) {
    // support a parameter that for example is a file path with slashes (like on github)
    return val.split('/').map(encodeURIComponent); // path-to-regexp supports arrays for this use case
  }

  var capitalize = route.capitalizedWords || opts.capitalizedWords && route.capitalizedWords !== false;

  if (capitalize && typeof val === 'string') {
    return val.replace(/ /g, '-').toLowerCase();
  }
  return opts.toPath ? opts.toPath(val, key, encodedVal, route, opts) : val === undefined ? undefined : encodedVal;
};

var formatQuery = function formatQuery(query, route, opts) {
  var def = route.defaultQuery || opts.defaultQuery;
  query = def ? typeof def === 'function' ? def(query, route, opts) : { ...def, ...query } : query;

  var to = route.toSearch || opts.toSearch;

  if (to && query) {
    var newQuery = {};

    for (var key in query) {
      newQuery[key] = to(query[key], key, route, opts);
    }

    return newQuery;
  }

  return query;
};

var formatHash = function formatHash() {
  var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var route = arguments[1];
  var opts = arguments[2];

  var def = route.defaultHash || opts.defaultHash;
  hash = def ? typeof def === 'function' ? def(hash, route, opts) : hash || def : hash;
  var to = route.toHash || opts.toHash;
  return to ? to(hash, route, opts) : hash;
};

var formatState = function formatState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var route = arguments[1];
  var opts = arguments[2];

  var def = route.defaultState || opts.defaultState;
  return def ? typeof def === 'function' ? def(state, route, opts) : { ...def, ...state } : state;
}; // state has no string counter part in the address bar, so there is no `toState`

var notFoundUrl = function notFoundUrl(action, routes, opts, query, hash) {
  var prevRoute = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';

  var type = action.type || '';
  var route = routes[type] || {};
  var hasScene = type.indexOf('/NOT_FOUND') > -1;
  // TODO: Look into scene stuff
  // $FlowFixMe
  var scene = route.scene || prevRoute.scene || '';
  var t = hasScene ? type : routes[scene + '/NOT_FOUND'] // try to interpret scene-level NOT_FOUND if available (note: links create plain NOT_FOUND actions)
  ? scene + '/NOT_FOUND' : 'NOT_FOUND';

  var p = routes[t].path || routes.NOT_FOUND.path || '';
  // $FlowFixMe
  var s = query ? opts.stringifyQuery(query, { addQueryPrefix: true }) : ''; // preserve these (why? because we can)
  var h = hash ? '#' + hash : '';

  return p + s + h;
};