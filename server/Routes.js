import HTTPRoutes from "./HTTP/index.js";

export default app => {
    // HTTP routes
    app.register(HTTPRoutes);

    // fallback to 404 page
    app.setNotFoundHandler((request, reply) => {
        reply.code(404).send("Page not found");
    });
};
