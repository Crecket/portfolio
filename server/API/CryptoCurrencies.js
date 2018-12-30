module.exports = app => {
    app.get("/api/test", (request, reply) => {
        app.walletDatabaseRepository
            .get("0x7093460094f97c9f2f5d830c8433662721c05df4")
            .then(results => {
                reply.send(results);
            })
            .catch(error => {
                reply.send(error);
            });
    });
};
