module.exports = app => {
    app.get("/", (request, reply) => {
        reply.sendFile("./index.html");
    });
    app.get("/404", (request, reply) => {
        reply.sendFile("./404/index.html");
    });
    app.get("/projects", (request, reply) => {
        reply.sendFile("./projects/index.html");
    });

    app.setNotFoundHandler((request, reply) => {
        reply.code(404).sendFile("./404/index.html");
    });
};
