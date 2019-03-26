export default (app, opts, next) => {
    // fallback to 404 page

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
