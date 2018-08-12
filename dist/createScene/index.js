'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (routesMap) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var sc = opts.scene,
      bn = opts.basename,
      formatter = opts.formatRoute,
      _opts$subtypes = opts.subtypes,
      st = _opts$subtypes === undefined ? [] : _opts$subtypes,
      log = opts.logExports;


  var scene = sc || '';
  var prefix = scene ? scene + '/' : '';
  var keys = Object.keys(routesMap);
  var subtypes = [].concat(_toConsumableArray(st), ['start', 'complete', 'error', 'done']);

  var result = keys.reduce(function (result, t) {
    var types = result.types,
        actions = result.actions,
        routes = result.routes;


    var t2 = '' + prefix + t;
    var tc = '' + prefix + t + '_COMPLETE';
    var te = '' + prefix + t + '_ERROR';

    routes[t2] = (0, _utils.formatRoute)(routesMap[t], t2, routesMap, formatter);

    var route = routes[t2];
    var tClean = route.scene ? t2.replace(route.scene + '/', '') : t; // strip the scene so types will be un-prefixed (NOTE: this is normalization for if routes pass through `createScene` twice)
    var action = (0, _utils.camelCase)(tClean);

    types[tClean] = t2;
    types[tClean + '_COMPLETE'] = tc;
    types[tClean + '_ERROR'] = te;

    // allow for creating custom action creators (whose names are an array assigned to route.action)
    if (Array.isArray(route.action)) {
      var key = route.action[0];
      actions[action] = (0, _utils.makeActionCreator)(route, t2, key, bn); // the first action in the array becomes the primary action creator

      // all are tacked on like action.complete, action.error
      route.action.forEach(function (key) {
        actions[action][key] = (0, _utils.makeActionCreator)(route, t2, key, bn);
      });
    } else {
      actions[action] = (0, _utils.makeActionCreator)(route, t2, 'action', bn);
    }

    subtypes.forEach(function (name) {
      var suffix = '_' + name.toUpperCase();
      var cleanType = '' + tClean + suffix;
      var realType = '' + prefix + t + suffix;

      types[cleanType] = realType;
      actions[action][name] = (0, _utils.makeActionCreator)(route, realType, name, bn, subtypes);
    });

    return result;
  }, { types: {}, actions: {}, routes: {} });

  var types = result.types,
      actions = result.actions;
  // $FlowFixMe

  if (log && /^(development|test)$/.test(process.env.NODE_ENV)) {
    result.exportString = (0, _utils.logExports)(types, actions, result.routes, opts);
  }

  return result;
};