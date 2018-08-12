'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (action) {
  var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 302;
  return {
    ...action,
    location: {
      // $FlowFixMe
      ...action.location,
      status: status,
      kind: 'replace'
    }
  };
};