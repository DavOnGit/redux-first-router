"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (o, type, basename) {
  return o && o.error ? { type: type, basename: basename, ...o } : { type: type, basename: basename, error: o };
};