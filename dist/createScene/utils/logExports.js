'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../../utils');

exports.default = function (types, actions, routes, options) {
  var opts = { ...options };
  opts.scene = (0, _utils.typeToScene)(Object.keys(routes)[0]);
  delete opts.logExports;

  var optsString = JSON.stringify(opts).replace(/"scene":/, 'scene: ').replace(/"basename":/, 'basename: ').replace(/"/g, "'").replace('{', '{ ').replace('}', ' }').replace(/,/g, ', ');

  var t = '';
  for (var type in types) {
    t += '\n\t' + type + ',';
  }var a = '';
  for (var action in actions) {
    a += '\n\t' + action + ',';
  } // destructure createActions()
  var exports = 'const { types, actions } = createScene(routes, ' + optsString + ')';
  exports += '\n\nconst { ' + t.slice(0, -1) + '\n} = types';
  exports += '\n\nconst { ' + a.slice(0, -1) + '\n} = actions';

  // types exports
  exports += '\n\nexport {' + t;
  exports = exports.slice(0, -1) + '\n}';

  // actions exports
  exports += '\n\nexport {' + a;
  exports = exports.slice(0, -1) + '\n}';

  if (process.env.NODE_ENV !== 'test') console.log(exports);
  return exports;
};