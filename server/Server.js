require("dotenv").config();
import fs from "fs";
import chalk from "chalk";

import Plugins from "./Plugins.js";
import Routes from "./Routes.js";

const fastify = require("fastify");
const httpPort = process.env.SERVER_PORT;

const options = {};
if (process.env.SSL_KEY_FILE && process.env.SSL_CRT_FILE) {
    options.http2 = true;
    options.https = {
        allowHTTP1: true, // fallback support for HTTP1
        key: fs.readFileSync(process.env.SSL_KEY_FILE),
        cert: fs.readFileSync(process.env.SSL_CRT_FILE)
    };
}

const app = fastify(options);

// Overwrite all error handlers at the top level after ready event
app.setErrorHandler((error, request, reply) => {
    const isApi = request.req.originalUrl.indexOf("/api") === 0;
    const errorOutput = isApi ? { error: error.message } : error.message;

    reply.code(500).send(errorOutput);
});

// register the fastify plugins
Plugins(app);

// register the routes
Routes(app);

app.listen(httpPort, (err, address) => {
    if (err) throw err;
    console.log(
        `Server running at ${chalk.green(httpPort)} - ${chalk.yellow(
            `https://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`
        )}`
    );
});

app.ready(err => {
    // console.log(app.printRoutes());
});
