const fastifyCors = require("fastify-cors");

export default (app, opts, next) => {
    // enable cors requests for the API
    app.register(fastifyCors);

    next();
};
