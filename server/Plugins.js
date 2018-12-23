const path = require("path");

const fastifyHelmet = require("fastify-helmet");
const fastifyCompress = require("fastify-compress");
const fastifyStatic = require("fastify-static");

module.exports = app => {
    app.register(fastifyHelmet);
    app.register(fastifyCompress);
    app.register(fastifyStatic, {
        root: path.join(__dirname, "..", "build")
    });
};
