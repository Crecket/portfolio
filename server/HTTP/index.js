const StaticRouteLoader = require("./StaticRouteLoader");
const blackListedRoutes = ["/"];

export default (app, opts, next) => {
    const staticRoutes = StaticRouteLoader();

    staticRoutes.forEach(staticRoute => {
        if (!staticRoute.url || blackListedRoutes.includes(staticRoute.url)) return;

        // register an actual route so the inital response isn't 404
        app.get(staticRoute.url, (request, reply) => {
            reply.sendFile(staticRoute.publicLocation);
        });
    });

    app.setNotFoundHandler((request, reply) => {
        const isApi = request.raw.originalUrl.indexOf("/api") === 0;

        if (isApi) {
            reply.code(404).send({ error: "Page not found" });
        } else {
            reply.code(404).sendFile("notfound/index.html");
        }
    });

    next();
};
