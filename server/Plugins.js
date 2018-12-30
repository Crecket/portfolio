const path = require("path");
const fastifyPlugin = require("fastify-plugin");

const fastifyHelmet = require("fastify-helmet");
const fastifyCompress = require("fastify-compress");
const fastifyStatic = require("fastify-static");

const EtherScanApiRepository = require("./Repositories/EtherScanApiRepository");
const WalletDatabaseRepository = require("./Repositories/WalletDatabaseRepository");

module.exports = app => {
    app.register(fastifyHelmet);
    app.register(fastifyCompress);
    app.register(fastifyStatic, {
        root: path.join(__dirname, "..", "build")
    });

    // register the mongoose plugin to setup mongodb
    app.register(require("./MongoDB/MongoosePlugin"), {});

    app.register(
        fastifyPlugin((fastify, options, next) => {
            app.decorate("etherScanApiRepository", new EtherScanApiRepository(process.env.ETHER_SCAN_API_KEY));
            next();
        })
    );
    app.register(
        fastifyPlugin((fastify, options, next) => {
            app.decorate("walletDatabaseRepository", new WalletDatabaseRepository());
            next();
        })
    );
};
