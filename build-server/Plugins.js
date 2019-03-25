"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var path = _interopRequireWildcard(require("path"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const fastifyHelmet = require("fastify-helmet");

const fastifyCompress = require("fastify-compress");

const fastifyAuth = require("fastify-auth");

const fastifyStatic = require("fastify-static");

var _default = app => {
  app.register(fastifyHelmet);
  app.register(fastifyCompress);
  app.register(fastifyAuth);
  app.register(fastifyStatic, {
    root: path.join(__dirname, "..", "build")
  });
};

exports.default = _default;