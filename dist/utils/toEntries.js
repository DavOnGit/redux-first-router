'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findInitialN = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _index = require('./index');

exports.default = function (api, entries, index, n) {
  entries = isSingleEntry(entries) ? [entries] : entries;
  entries = entries.length === 0 ? ['/'] : entries;
  entries = entries.map(function (e) {
    return (0, _index.toAction)(api, e);
  });

  index = index !== undefined ? index : entries.length - 1; // default to head of array
  index = Math.min(Math.max(index, 0), entries.length - 1); // insure the index is in range

  n = n || findInitialN(index, entries); // initial direction the user is going across the history track

  return { n: n, index: index, entries: entries };
};

// When entries are restored on load, the direction is always forward if on an index > 0
// because the corresponding entries are removed (just like a `push`), and you are now at the head.
// Otherwise, if there are multiple entries and you are on the first, you're considered
// to be going back, but if there is one, you're logically going forward.

var findInitialN = exports.findInitialN = function findInitialN(index, entries) {
  return index > 0 ? 1 : entries.length > 1 ? -1 : 1;
};
var isSingleEntry = function isSingleEntry(e) {
  return !Array.isArray(e) ||
  // $FlowFixMe
  typeof e[0] === 'string' && _typeof(e[1]) === 'object' && !e[1].type;
}; // pattern match: [string, state]