require("dotenv").config();
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const fastify = require("fastify");
const fastifyHelmet = require("fastify-helmet");
const fastifyCompress = require("fastify-compress");
const fastifyStatic = require("fastify-static");
const fastifyAutoPush = require("fastify-auto-push").staticServe;

const SpdyHelper = require("./src/server/SpdyHelper");

const httpPort = process.env.PORT;
const http2Port = process.env.PORT_SSL;

const defaultCallback = (req, res) => {
    const spdyHelper = new SpdyHelper(req, res);
    spdyHelper.addGlob("static/css/**/*.css", "text/css");
    spdyHelper.addGlob("static/js/**/*.js", "application/javascript");

    spdyHelper.finish().finally(done => {
        res.sendFile(path.resolve("./build/index.html"));
    });
};

const app = fastify({
    http2: true,
    https: {
        allowHTTP1: true, // fallback support for HTTP1
        key: fs.readFileSync(process.env.SSL_KEY_FILE),
        cert: fs.readFileSync(process.env.SSL_CRT_FILE)
    }
});

app.register(fastifyHelmet);
app.register(fastifyCompress);
app.register(fastifyStatic, {
    root: path.join(__dirname, "build")
});
// app.register(fastifyAutoPush, { root: path.resolve("build/static") });

app.get("/", (request, reply) => {
    reply.sendFile("./index.html");
});

app.setNotFoundHandler((request, reply) => {
    reply.code(404).sendFile("./404/index.html");
});

app.setErrorHandler((error, request, reply) => {
    request.log.warn(error);
    const statusCode = error.statusCode >= 400 ? error.statusCode : 500;

    reply.code(statusCode).send("500 error");
});

app.listen(http2Port, (err, address) => {
    if (err) throw err;
    console.log(`HTTP2 running at ${chalk.green(http2Port)} - ${chalk.yellow(address)}`);
});
