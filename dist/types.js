'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var PREFIX = exports.PREFIX = '@@rudy';
var prefixType = exports.prefixType = function prefixType(type, prefix) {
  return (prefix || PREFIX) + '/' + type;
};

var CALL_HISTORY = exports.CALL_HISTORY = prefixType('CALL_HISTORY');
var NOT_FOUND = exports.NOT_FOUND = prefixType('NOT_FOUND');
var ADD_ROUTES = exports.ADD_ROUTES = prefixType('ADD_ROUTES');
var CHANGE_BASENAME = exports.CHANGE_BASENAME = prefixType('CHANGE_BASENAME');
var CLEAR_CACHE = exports.CLEAR_CACHE = prefixType('CLEAR_CACHE');

var CONFIRM = exports.CONFIRM = prefixType('CONFIRM');
var BLOCK = exports.BLOCK = prefixType('BLOCK', '@@skiprudy'); // these skip middleware pipeline, and are reducer-only
var UNBLOCK = exports.UNBLOCK = prefixType('UNBLOCK', '@@skiprudy');

var SET_FROM = exports.SET_FROM = prefixType('SET_FROM', '@@skiprudy');