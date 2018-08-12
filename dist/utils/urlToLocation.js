'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var createLocationObject = function createLocationObject(url) {
  var pathname = url || '/';
  var search = '';
  var hash = '';

  var hashIndex = pathname.indexOf('#');
  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex + 1); // remove # from hash
    pathname = pathname.substr(0, hashIndex); // remove hash value from pathname
  }

  var searchIndex = pathname.indexOf('?');
  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex + 1); // remove ? from search
    pathname = pathname.substr(0, searchIndex); // remove search value from pathname
  }

  pathname = pathname || '/'; // could be empty on URLs that like: '?foo=bar#hash

  return { pathname: pathname, search: search, hash: hash };
};

exports.default = function (url) {
  if ((typeof url === 'undefined' ? 'undefined' : _typeof(url)) === 'object' && url.pathname !== undefined) return url;
  return createLocationObject(url);
};