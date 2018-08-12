'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPrevEmpty = exports.createPrev = exports.createInitialState = undefined;

var _types = require('../types');

var _utils = require('../utils');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (initialState, routes) {
  return function () {
    var st = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    var r = routes[action.type];
    var l = action.location;
    if (l && l.kind === 'set') {
      var commit = action.commit,
          _action$location = action.location,
          kind = _action$location.kind,
          location = _objectWithoutProperties(_action$location, ['kind']),
          act = _objectWithoutProperties(action, ['commit', 'location']);

      return { ...st, ...act, ...location };
    }

    if (r && r.path && (l.url !== st.url || /load|reset/.test(l.kind))) {
      var type = action.type,
          params = action.params,
          query = action.query,
          state = action.state,
          hash = action.hash,
          basename = action.basename;
      var universal = st.universal;

      var s = { type: type, params: params, query: query, state: state, hash: hash, basename: basename, universal: universal, ...l };
      if (st.ready === false) s.ready = true;
      return s;
    }

    if (action.type === _types.ADD_ROUTES) {
      var routesAdded = action.payload.routesAdded;

      return { ...st, routesAdded: routesAdded };
    }

    if (action.type === _types.SET_FROM) {
      var ref = action.payload.ref;

      return { ...st, from: ref };
    }

    if (action.type === _types.BLOCK) {
      var _ref = action.payload.ref;

      return { ...st, blocked: _ref };
    }

    if (action.type === _types.UNBLOCK) {
      return { ...st, blocked: null };
    }

    if (action.type.indexOf('_ERROR') > -1) {
      var error = action.error,
          errorType = action.type;

      return { ...st, error: error, errorType: errorType };
    }

    if (action.type.indexOf('_COMPLETE') > -1) {
      return { ...st, ready: true };
    }

    if (action.type.indexOf('_START') > -1) {
      return { ...st, ready: false };
    }

    return st;
  };
};

var createInitialState = exports.createInitialState = function createInitialState(action) {
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


  var direction = n === -1 ? 'backward' : 'forward';
  var prev = createPrev(location);
  var universal = (0, _utils.isServer)();
  var status = (0, _utils.isNotFound)(type) ? 404 : 200;

  return {
    kind: 'init',
    direction: direction,
    n: n,

    type: type,
    params: params,
    query: query,
    state: state,
    hash: hash,
    basename: basename,

    url: url,
    pathname: pathname,
    search: search,
    key: key,
    scene: scene,

    prev: prev,
    from: null,
    blocked: null,

    entries: entries,
    index: index,
    length: length,

    universal: universal,
    pop: false,
    status: status
  };
};

var createPrev = exports.createPrev = function createPrev(location) {
  var n = location.n,
      i = location.index,
      entries = location.entries; // needs to use real lastIndex instead of -1

  var index = i + n * -1; // the entry action we want is the opposite of the direction the user is going
  var prevAction = entries[index];

  if (!prevAction) return createPrevEmpty();

  return {
    ...prevAction,
    location: {
      ...prevAction.location,
      index: index
    }
  };
};

var createPrevEmpty = exports.createPrevEmpty = function createPrevEmpty() {
  return {
    type: '',
    params: {},
    query: {},
    state: {},
    hash: '',
    basename: '',
    location: {
      url: '',
      pathname: '',
      search: '',
      key: '',
      scene: '',
      index: -1
    }
  };
};