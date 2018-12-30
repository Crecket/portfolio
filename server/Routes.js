const routes = require("../src/Config/routes");
const Api = require("./API/index.js");

module.exports = app => {
    // page routes
    app.get("/", (request, reply) => reply.sendFile("./index.html"));

    Object.keys(routes).forEach(routePattern => {
        app.get(routePattern, (request, reply) => reply.sendFile(`.${routePattern}/index.html`));
    });

    // API routes
    Api(app);

    // fallback to 404 page
    app.setNotFoundHandler((request, reply) => {
        reply.code(404).sendFile("./404/index.html");
    });
};
