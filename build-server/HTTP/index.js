"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (app, opts, next) => {
  // app.get("/*", async (request, reply) => reply.sendFile("index.html"));
  next();
};

exports.default = _default;