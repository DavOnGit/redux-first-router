'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actions = require('../actions');

exports.default = function (_ref) {
  var route = _ref.route,
      routes = _ref.routes,
      action = _ref.action,
      dispatch = _ref.dispatch;

  var t = route.redirect;
  // $FlowFixMe
  var scenicType = route.scene + '/' + t;
  var type = routes[scenicType] ? scenicType : t;

  // $FlowFixMe
  return dispatch((0, _actions.redirect)({ ...action, type: type }, 301));
};