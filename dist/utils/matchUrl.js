'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchVal = exports.matchHash = exports.matchQuery = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

exports.default = function (loc, matchers) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var route = arguments[3];
  var opts = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var _urlToLocation = (0, _index.urlToLocation)(loc),
      pathname = _urlToLocation.pathname,
      search = _urlToLocation.search,
      h = _urlToLocation.hash;

  var _matchPath = matchPath(pathname, matchers.path, options),
      match = _matchPath.match,
      keys = _matchPath.keys;

  if (!match) return null;

  var query = matchQuery(search, matchers.query, route, opts);
  if (!query) return null;

  var hash = matchHash(h, matchers.hash, route, opts);
  if (hash === null) return null;

  var _match = _toArray(match),
      path = _match[0],
      values = _match.slice(1);

  var params = keys.reduce(function (params, key, index) {
    params[key.name] = values[index];
    return params;
  }, {});

  var formatParams = options.formatParams,
      formatQuery = options.formatQuery,
      formatHash = options.formatHash;


  return {
    params: formatParams ? formatParams(params, route, opts) : params,
    query: formatQuery ? formatQuery(query, route, opts) : query,
    hash: formatHash ? formatHash(hash || '', route, opts) : hash || '',
    matchedPath: matchers.path === '/' && path === '' ? '/' : path, // the matched portion of the URL/path
    matchers: matchers,
    partial: !!options.partial

    // const url = matchers.path === '/' && path === '' ? '/' : path // the matched portion of the path

    // return {
    //   path: matchers.path,
    //   url, // called `url` instead of `path` for compatibility with React Router
    //   isExact: pathname === path,
    //   params: fromPath ? fromPath(params, route, opts) : params,
    //   query: fromSearch ? fromSearch(query, route, opts) : query,
    //   hash: fromHash ? fromHash(hash || '', route, opts) : (hash || '')
    // }
  };
};

var matchPath = function matchPath(pathname, matcher) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _compilePath = compilePath(matcher, options),
      re = _compilePath.re,
      keys = _compilePath.keys;

  var match = re.exec(pathname);

  if (!match || options.exact && match[0] !== pathname) return {};

  return { match: match, keys: keys };
};

var matchQuery = exports.matchQuery = function matchQuery(search, matcher, route, opts) {
  var query = search ? parseSearch(search, route, opts) : {};

  if (!matcher) return query;

  for (var key in matcher) {
    var val = query[key];
    var expected = matcher[key];
    if (!matchVal(val, expected, key, route, opts)) return null;
  }

  return query;
};

var matchHash = exports.matchHash = function matchHash() {
  var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var expected = arguments[1];
  var route = arguments[2];
  var opts = arguments[3];

  if (expected === undefined) return hash;
  return matchVal(hash, expected, 'hash', route, opts) ? hash : null;
};

var matchVal = exports.matchVal = function matchVal(val,
// TODO: What flow-type is best for expected
// $FlowFixMe
expected, key, route, opts) {
  var type = typeof expected === 'undefined' ? 'undefined' : _typeof(expected);

  if (type === 'boolean') {
    if (expected === true) {
      return val !== '' && val !== undefined;
    }

    return val === undefined || val === '';
  } else if (type === 'string') {
    return expected === val;
  } else if (type === 'function') {
    return key === 'hash'
    // $FlowFixMe
    ? expected(val, route, opts)
    // $FlowFixMe
    : expected(val, key, route, opts);
  } else if (expected instanceof RegExp) {
    return expected.test(val);
  }

  return true;
};

var parseSearch = function parseSearch(search, route, opts) {
  if (queries[search]) return queries[search];
  var parse = route.parseSearch || opts.parseSearch;
  return queries[search] = parse(search);
};

var queries = {};
var patternCache = {};

var cacheLimit = 10000;
var cacheCount = 0;

var compilePath = function compilePath(pattern) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$partial = options.partial,
      partial = _options$partial === undefined ? false : _options$partial,
      _options$strict = options.strict,
      strict = _options$strict === undefined ? false : _options$strict;


  var cacheKey = '' + (partial ? 't' : 'f') + (strict ? 't' : 'f');
  var cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  if (cache[pattern]) return cache[pattern];

  var keys = [];
  var re = (0, _pathToRegexp2.default)(pattern, keys, { end: !partial, strict: strict });
  var compiledPattern = { re: re, keys: keys };

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern;
    cacheCount++;
  }
  // TODO: Not sure the best way to construct this one
  // $FlowFixMe
  return compiledPattern;
};