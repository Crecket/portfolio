const fs = require("fs");
const chalk = require("chalk");

const fastify = require("fastify");
const http2Port = process.env.PORT_SSL;

const app = fastify({
    http2: true,
    https: {
        allowHTTP1: true, // fallback support for HTTP1
        key: fs.readFileSync(process.env.SSL_KEY_FILE),
        cert: fs.readFileSync(process.env.SSL_CRT_FILE)
    }
});

// register the fastify plugins
require("./Plugins.js")(app);

// register the routes
require("./Routes.js")(app);

// register the routes
require("./HttpProxy.js")();

app.setErrorHandler((error, request, reply) => {
    request.log.warn(error);
    const statusCode = error.statusCode >= 400 ? error.statusCode : 500;

    reply.code(statusCode).send("500 error");
});

app.listen(http2Port, process.env.SERVER_HOSTNAME, (err, address) => {
    if (err) throw err;
    console.log(`HTTP2 running at ${chalk.green(http2Port)} - ${chalk.yellow(address)}`);
});
