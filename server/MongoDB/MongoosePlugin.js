const mongoose = require("mongoose");
const fastifyPlugin = require("fastify-plugin");
const Models = require("./Models");

function mongoosePlugin(fastify, options, next) {
    // register the models
    Models();

    // attempt to connect with mongodb
    mongoose.connect(
        `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`,
        {
            useNewUrlParser: true
        },
        error => {
            if (error) {
                console.error("Failed to connect");
                console.error(error);
                process.exit();
            } else {
                console.log("Setup mongoose connection with models:");
                console.log(Object.keys(mongoose.models));
            }

            fastify.decorate("mongoose", mongoose);
            next();
        }
    );
}

module.exports = fastifyPlugin(mongoosePlugin);
