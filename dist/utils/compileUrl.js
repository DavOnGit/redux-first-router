'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pathToRegexp = require('path-to-regexp');

var _matchUrl = require('./matchUrl');

var toPathCache = {};

exports.default = function (path) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var query = arguments[2];
  var hash = arguments[3];
  var route = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var opts = arguments[5];

  var search = query ? stringify(query, route, opts) : '';

  if (route.query && !(0, _matchUrl.matchQuery)(search, route.query, route, opts)) {
    throw new Error('[rudy] invalid query object');
  }

  if (route.hash !== undefined && (0, _matchUrl.matchHash)(hash, route.hash, route, opts) == null) {
    throw new Error('[rudy] invalid hash value');
  }

  var toPath = toPathCache[path] = toPathCache[path] || (0, _pathToRegexp.compile)(path);

  var p = toPath(params, { encode: function encode(x) {
      return x;
    } });
  var s = search ? '?' + search : '';
  var h = hash ? '#' + hash : '';

  return p + s + h;
};

var stringify = function stringify(query, route, opts) {
  var search = (route.stringifyQuery || opts.stringifyQuery)(query);

  if (process.env.NODE_ENV === 'development' && search.length > 2000) {
    // https://stackoverflow.com/questions/812925/what-is-the-maximum-possible-length-of-a-query-string
    console.error('[rudy] query is too long: ' + search.length + ' chars (max: 2000)');
  }

  return search;
};