'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _supports = require('./supports');

Object.defineProperty(exports, 'supportsDom', {
  enumerable: true,
  get: function get() {
    return _supports.supportsDom;
  }
});
Object.defineProperty(exports, 'supportsHistory', {
  enumerable: true,
  get: function get() {
    return _supports.supportsHistory;
  }
});
Object.defineProperty(exports, 'supportsSession', {
  enumerable: true,
  get: function get() {
    return _supports.supportsSession;
  }
});

var _popListener = require('./popListener');

Object.defineProperty(exports, 'addPopListener', {
  enumerable: true,
  get: function get() {
    return _popListener.addPopListener;
  }
});
Object.defineProperty(exports, 'removePopListener', {
  enumerable: true,
  get: function get() {
    return _popListener.removePopListener;
  }
});
Object.defineProperty(exports, 'isExtraneousPopEvent', {
  enumerable: true,
  get: function get() {
    return _popListener.isExtraneousPopEvent;
  }
});

var _sessionStorage = require('./sessionStorage');

Object.defineProperty(exports, 'saveHistory', {
  enumerable: true,
  get: function get() {
    return _sessionStorage.saveHistory;
  }
});
Object.defineProperty(exports, 'restoreHistory', {
  enumerable: true,
  get: function get() {
    return _sessionStorage.restoreHistory;
  }
});
Object.defineProperty(exports, 'get', {
  enumerable: true,
  get: function get() {
    return _sessionStorage.get;
  }
});
Object.defineProperty(exports, 'set', {
  enumerable: true,
  get: function get() {
    return _sessionStorage.set;
  }
});
Object.defineProperty(exports, 'clear', {
  enumerable: true,
  get: function get() {
    return _sessionStorage.clear;
  }
});
Object.defineProperty(exports, 'pushState', {
  enumerable: true,
  get: function get() {
    return _sessionStorage.pushState;
  }
});
Object.defineProperty(exports, 'replaceState', {
  enumerable: true,
  get: function get() {
    return _sessionStorage.replaceState;
  }
});