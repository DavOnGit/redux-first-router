'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index');

exports.default = function (action, redirectFunc) {
  if ((0, _index.isRedirect)(action)) {
    var url = action.location.url;
    var status = action.location.status || 302;

    if (typeof redirectFunc === 'function') {
      redirectFunc(status, url, action);
    } else if (redirectFunc && typeof redirectFunc.redirect === 'function') {
      redirectFunc.redirect(status, url);
    }

    return true;
  }

  return false;
};