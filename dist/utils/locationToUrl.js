'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (location) {
  if (typeof location === 'string') return location;

  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;


  var path = pathname || '/';

  if (search && search !== '?') {
    path += search.charAt(0) === '?' ? search : '?' + search;
  }

  if (hash && hash !== '#') {
    path += hash.charAt(0) === '#' ? hash : '#' + hash;
  }

  return path;
};