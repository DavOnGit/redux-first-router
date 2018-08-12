'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../../utils');

exports.default = function (name, route, req) {
  if (!route[name] && !req.options[name]) return false;

  // skip callbacks (beforeEnter, thunk, etc) called on server, which produced initialState
  if ((0, _utils.isHydrate)(req) && !/onEnter|onError/.test(name)) return false;

  // dont allow these client-centric callbacks on the server
  if ((0, _utils.isServer)() && /onEnter|Leave/.test(name)) return false;

  return allowBoth;
};

var allowBoth = { route: true, options: true

  // If for instance, you wanted to allow each route to decide
  // whether to skip options callbacks, here's a simple way to do it:
  //
  // return {
  //   options: !route.skipOpts, // if true, don't make those calls
  //   route: true
  // }
  //
  // You also could choose to automatically trigger option callbacks only as a fallback:
  //
  // return {
  //   options: !route[name],
  //   route: !!route[name]
  // }

};