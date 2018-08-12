'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

exports.default = function (api) {
  return function (req, next) {
    if ((0, _utils.isServer)() && (0, _utils.isRedirect)(req.action)) {
      var action = req.action;

      var _actionToUrl = (0, _utils.actionToUrl)(action, api),
          url = _actionToUrl.url;

      action.url = action.location.url = url;
      action.status = action.location.status || 302;

      // account for anonymous thunks potentially redirecting without returning itself
      // and not able to be discovered by regular means in `utils/createRequest.js`
      req.ctx.serverRedirect = true;

      return action;
    }

    return next();
  };
};