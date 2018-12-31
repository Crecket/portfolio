import path from "path";
const fastifyPlugin = require("fastify-plugin");
const fastifyHelmet = require("fastify-helmet");
const fastifyCompress = require("fastify-compress");
const fastifyStatic = require("fastify-static");

import MongoosePlugin from "./MongoDB/MongoosePlugin";
import WalletRepository from "./Repositories/WalletRepository";

export default app => {
    app.register(fastifyHelmet);
    app.register(fastifyCompress);
    app.register(fastifyStatic, {
        root: path.join(__dirname, "..", "build")
    });

    // register the mongoose plugin to setup mongodb
    app.register(MongoosePlugin, {});

    app.register(
        fastifyPlugin((fastify, options, next) => {
            app.decorate("walletRepository", new WalletRepository());
            next();
        })
    );
};
