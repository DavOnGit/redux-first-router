'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _index = require('./index');

var _utils = require('../utils');

var _middleware = require('../middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var routesInput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var middlewares = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [_middleware.serverRedirect, // short-circuiting middleware
  _middleware.anonymousThunk, (0, _middleware.pathlessRoute)('thunk'), _middleware.transformAction, // pipeline starts here
  (0, _middleware.call)('beforeLeave', { prev: true }), (0, _middleware.call)('beforeEnter'), _middleware.enter, _middleware.changePageTitle, (0, _middleware.call)('onLeave', { prev: true }), (0, _middleware.call)('onEnter'), (0, _middleware.call)('thunk', { cache: true }), (0, _middleware.call)('onComplete')];
  var location = options.location,
      title = options.title,
      formatRoute = options.formatRoute,
      _options$createHistor = options.createHistory,
      createSmartHistory = _options$createHistor === undefined ? _index.createHistory : _options$createHistor,
      _options$createReduce = options.createReducer,
      createLocationReducer = _options$createReduce === undefined ? _index.createReducer : _options$createReduce,
      _options$createInitia = options.createInitialState,
      createState = _options$createInitia === undefined ? _index.createInitialState : _options$createInitia,
      onErr = options.onError;

  // assign to options so middleware can override them in 1st pass if necessary

  options.shouldTransition = options.shouldTransition || _utils.shouldTransition;
  options.createRequest = options.createRequest || _index.createRequest;
  options.compose = options.compose || _index.compose;
  options.onError = typeof onErr !== 'undefined' ? onErr : _utils.onError;
  options.parseSearch = options.parseSearch || _utils.parseSearch;
  options.stringifyQuery = options.stringifyQuery || _qs2.default.stringify;

  var routes = (0, _utils.formatRoutes)(routesInput, formatRoute);
  var selectLocationState = (0, _utils.createSelector)('location', location);
  var selectTitleState = (0, _utils.createSelector)('title', title);
  var history = createSmartHistory(routes, options);
  var firstAction = history.firstAction;

  var initialState = createState(firstAction);
  var reducer = createLocationReducer(initialState, routes);
  var wares = {};
  var register = function register(name) {
    var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    return wares[name] = val;
  };
  var has = function has(name) {
    return wares[name];
  };
  var ctx = { busy: false };
  var api = { routes: routes, history: history, options: options, register: register, has: has, ctx: ctx };
  var onError = (0, _middleware.call)('onError')(api);
  var nextPromise = options.compose(middlewares, api, true);

  var middleware = function middleware(_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;

    var getTitle = function getTitle() {
      return selectTitleState(getState() || {});
    };
    var getLocation = function getLocation(s) {
      return selectLocationState(s || getState() || {});
    };
    var shouldTransition = options.shouldTransition,
        createRequest = options.createRequest; // middlewares may mutably monkey-patch these in above call to `compose`

    //TODO: Fix these annotations

    Object.assign(api, { getTitle: getTitle, getLocation: getLocation, dispatch: dispatch, getState: getState });

    getState.rudy = api; // make rudy available via `context` with no extra Providers, (see <Link />)
    history.listen(dispatch, getLocation); // dispatch actions in response to pops, use redux location state as single source of truth

    return function (dispatch) {
      return function (action) {
        if (!shouldTransition(action, api)) return dispatch(action); // short-circuit and pass through Redux middleware normally
        if (action.tmp && action.tmp.canceled) return Promise.resolve(action);

        var req = createRequest(action, api, dispatch); // the `Request` arg passed to all middleware
        var mw = req.route.middleware;
        var next = mw ? options.compose(mw, api, !!req.route.path) : nextPromise;

        return next(req) // start middleware pipeline
        .catch(function (error) {
          if (options.wallabyErrors) throw error; // wallaby UI is linkable if we don't re-throw errors (we'll see errors for the few tests of errors outside of wallaby)
          req.error = error;
          req.errorType = req.action.type + '_ERROR';
          return onError(req);
        }).then(function (res) {
          var route = req.route,
              tmp = req.tmp,
              ctx = req.ctx,
              clientLoadBusy = req.clientLoadBusy;

          var isRoutePipeline = route.path && !tmp.canceled && !clientLoadBusy;
          ctx.busy = isRoutePipeline ? false : ctx.busy;
          return res;
        });
      };
    };
  };

  return {
    ...api,
    middleware: middleware,
    reducer: reducer,
    firstRoute: function firstRoute() {
      var resolveOnEnter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      api.resolveFirstRouteOnEnter = resolveOnEnter;
      return firstAction;
    }
  };
};