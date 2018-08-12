'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBasename = exports.setHash = exports.setState = exports.setQuery = exports.setParams = exports.set = exports.next = exports.back = exports.reset = exports.jump = exports.replace = exports.push = undefined;

var _types = require('../types');

var push = exports.push = function push(path, state) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'push',
      args: [path, state]
    }
  };
};
var replace = exports.replace = function replace(path, state) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'replace',
      args: [path, state]
    }
  };
};

var jump = exports.jump = function jump(delta, state, byIndex, n) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'jump',
      args: [delta, state, byIndex, n]
    }
  };
};

var reset = exports.reset = function reset(entries, index, n) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'reset',
      args: [entries, index, n]
    }
  };
};

var back = exports.back = function back(state) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'back',
      args: [state]
    }
  };
};

var next = exports.next = function next(state) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'next',
      args: [state]
    }
  };
};

var set = exports.set = function set(action, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [action, n, byIndex]
    }
  };
};

var setParams = exports.setParams = function setParams(params, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{ params: params }, n, byIndex]
    }
  };
};

var setQuery = exports.setQuery = function setQuery(query, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{ query: query }, n, byIndex]
    }
  };
};

var setState = exports.setState = function setState(state, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{ state: state }, n, byIndex]
    }
  };
};

var setHash = exports.setHash = function setHash(hash, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{ hash: hash }, n, byIndex]
    }
  };
};

var setBasename = exports.setBasename = function setBasename(basename, n, byIndex) {
  return {
    type: _types.CALL_HISTORY,
    payload: {
      method: 'set',
      args: [{ basename: basename }, n, byIndex]
    }
  };
};

// NOTE: see `src/utils/formatRoutes.js` for implementation of corresponding pathlessRoute