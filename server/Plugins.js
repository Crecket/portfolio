import * as path from "path";
const fastifyHelmet = require("fastify-helmet");
const fastifyCompress = require("fastify-compress");
const fastifyAuth = require("fastify-auth");
const fastifyStatic = require("fastify-static");

export default app => {
    app.register(fastifyHelmet);
    app.register(fastifyCompress);
    app.register(fastifyAuth);
    app.register(fastifyStatic, {
        root: path.join(__dirname, "..", "build")
    });
};
