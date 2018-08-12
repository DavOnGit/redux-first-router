'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActionRef = undefined;

var _index = require('./index');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (action, prevState, fromAction, statusCode) {
  var tmp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var location = action.location,
      type = action.type,
      basename = action.basename,
      params = action.params,
      query = action.query,
      state = action.state,
      hash = action.hash;
  var entries = location.entries,
      index = location.index,
      length = location.length,
      pathname = location.pathname,
      search = location.search,
      url = location.url,
      key = location.key,
      scene = location.scene,
      n = location.n;


  var prev = createActionRef(prevState);
  var from = createActionRef(fromAction);

  var kind = resolveKind(location.kind, tmp.load, from);
  var direction = n === -1 ? 'backward' : 'forward';

  var pop = !!tmp.revertPop;
  var status = from ? statusCode || 302 : (0, _index.isNotFound)(type) ? 404 : 200;

  return {
    type: type,
    params: params,
    query: query,
    state: state,
    hash: hash,
    basename: basename,
    location: {
      kind: kind,
      direction: direction,
      n: n,

      url: url,
      pathname: pathname,
      search: search,
      key: key,
      scene: scene,

      prev: prev,
      from: from,
      blocked: null,

      entries: entries,
      index: index,
      length: length,

      pop: pop,
      status: status
    }
  };
};

var createActionRef = exports.createActionRef = function createActionRef(actionOrState) {
  if (!actionOrState) return null;

  // if `prev` or redirect action from outside of pipeline, we receive the state instead (see ./formatAction.js)
  if (!actionOrState.location) {
    var type = actionOrState.type,
        params = actionOrState.params,
        query = actionOrState.query,
        state = actionOrState.state,
        hash = actionOrState.hash,
        basename = actionOrState.basename,
        rest = _objectWithoutProperties(actionOrState, ['type', 'params', 'query', 'state', 'hash', 'basename']);

    var location = createLocationRef(rest);
    var action = { type: type, params: params, query: query, state: state, hash: hash, basename: basename, location: location };
    return action;
  }

  // if redirect occurred during pipeline, we receive an action representing the previous state
  return {
    ...actionOrState,
    location: createLocationRef({ ...actionOrState.location })
  };
};

var createLocationRef = function createLocationRef(loc) {
  delete loc.prev;
  delete loc.from;
  delete loc.blocked;
  delete loc.universal;

  delete loc.length;
  delete loc.kind;
  delete loc.entries;
  delete loc.pop;
  delete loc.status;
  delete loc.direction;
  delete loc.n;
  delete loc.universal;
  delete loc.ready;

  return loc;
};

var resolveKind = function resolveKind(kind, isLoad, from) {
  return isLoad ? 'load' // insure redirects don't change kind on load
  : !from ? kind // PRIMARY USE CASE: preverse the standard kind
  : kind.replace('push', 'replace');
}; // pipeline redirects before enter are in fact pushes, but users shouldn't have to think about that -- using `kind.replace` preserves back/next kinds