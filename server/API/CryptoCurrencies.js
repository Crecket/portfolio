export default app => {
    app.get("/api/wallet/:id", (request, reply) => {
        app.walletRepository
            .get(request.params.id)
            .then(results => reply.send(results))
            .catch(error => reply.code(500).send(error));
    });

    app.get("/api/wallet", (request, reply) => {
        app.walletRepository
            .list()
            .then(results => reply.send(results))
            .catch(error => reply.code(500).send(error));
    });

    app.post("/api/wallet", (request, reply) => {
        // app.walletRepository
        //     .get("0x7093460094f97c9f2f5d830c8433662721c05df4", "ETH")
        //     .then(results => reply.send(results))
        //     .catch(error => reply.code(500).send(error));

        reply.send(["dang"]);
    });
};
