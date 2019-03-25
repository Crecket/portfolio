"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./HTTP/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = app => {
  // HTTP routes
  app.register(_index.default); // fallback to 404 page

  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send("Page not found");
  });
};

exports.default = _default;