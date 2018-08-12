'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var env = process.env.NODE_ENV;

exports.default = function (req) {
  var history = req.history,
      has = req.has,
      dispatch = req.dispatch,
      payload = req.action.payload;


  if (env === 'development' && !has('pathlessRoute')) {
    throw new Error('[rudy] "pathlessRoute" middleware is required to use history action creators.');
  }

  var method = payload.method,
      args = payload.args;


  if (method === 'set') return handleEdgeCaseForSet(req, args);

  var action = history[method].apply(history, _toConsumableArray(args).concat([false]));
  return dispatch(action);
};

// only state can be set before route change is committed,
// as otherwise the prev URL would change and break BrowserHistory entries tracking
// NOTE: we could greatly change the implementation to support this small thing, but its not worth the complexity;
// even just supporting setState on a previous route (while in the pipeline) is frill, but we'll soon see if people
// get use out of it.

var handleEdgeCaseForSet = function handleEdgeCaseForSet(_ref, args) {
  var ctx = _ref.ctx,
      tmp = _ref.tmp,
      commitDispatch = _ref.commitDispatch,
      history = _ref.history;

  if (ctx.pending && !tmp.committed) {
    if (!isOnlySetState(args[0])) {
      throw new Error('[rudy] you can only set state on a previous url before enter');
    }

    // mutable workaround to insure state is applied to ongoing action
    var prevState = ctx.pending.action.location.prev.state;
    Object.assign(prevState, args[0].state);
  }

  var _history$set = history.set.apply(history, _toConsumableArray(args).concat([false])),
      commit = _history$set.commit,
      action = _objectWithoutProperties(_history$set, ['commit']);

  // unlike other actions, sets go straight to reducer (and browser history) and skip pipeline.
  // i.e. it's purpose is to be a "hard" set


  commitDispatch(action);
  action._dispatched = true; // insure autoDispatch is prevented since its dispatched already here (similar to the implementation of `request.dispatch`)
  return commit(action).then(function () {
    return action;
  });
};

var isOnlySetState = function isOnlySetState(action) {
  return action.state && Object.keys(action).length === 1;
};