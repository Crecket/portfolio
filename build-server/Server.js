"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _chalk = _interopRequireDefault(require("chalk"));

var path = _interopRequireWildcard(require("path"));

var _Plugins = _interopRequireDefault(require("./Plugins.js"));

var _Routes = _interopRequireDefault(require("./Routes.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config();

const fastify = require("fastify");

const httpPort = process.env.SERVER_PORT;
const options = {};

if (process.env.SSL_KEY_FILE && process.env.SSL_CRT_FILE) {
  options.http2 = true;
  options.https = {
    allowHTTP1: true,
    // fallback support for HTTP1
    key: _fs.default.readFileSync(path.join(__dirname, "..", process.env.SSL_KEY_FILE)),
    cert: _fs.default.readFileSync(path.join(__dirname, "..", process.env.SSL_CRT_FILE))
  };
}

const app = fastify(options); // Overwrite all error handlers at the top level after ready event

app.setErrorHandler((error, request, reply) => {
  const isApi = request.req.originalUrl.indexOf("/api") === 0;
  const errorOutput = isApi ? {
    error: error.message
  } : error.message;
  reply.code(500).send(errorOutput);
}); // register the fastify plugins

(0, _Plugins.default)(app); // register the routes

(0, _Routes.default)(app);
app.listen(httpPort, (err, address) => {
  if (err) throw err;
  console.log(`Server running at ${_chalk.default.green(httpPort)} - ${_chalk.default.yellow(`https://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`)}`);
});
app.ready(err => {// console.log(app.printRoutes());
});