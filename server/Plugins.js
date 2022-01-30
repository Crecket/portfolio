import * as path from "path";
import SitemapPlugin from "./SitemapPlugin";

const fastifyHelmet = require("fastify-helmet");
const fastifyCompress = require("fastify-compress");
const fastifyAuth = require("fastify-auth");
const fastifyStatic = require("fastify-static");

export default app => {
    app.register(fastifyHelmet, {
        contentSecurityPolicy: false
    });
    app.register(fastifyCompress);
    app.register(fastifyAuth);
    app.register(fastifyStatic, {
        root: path.join(__dirname, "..", "build")
    });
    app.register(SitemapPlugin);
};
