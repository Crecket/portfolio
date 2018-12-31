export default app => {
    app.get("/api/test", (request, reply) => {
        app.walletRepository
            .get("0x7093460094f97c9f2f5d830c8433662721c05df4", "ETH")
            .then(results => {
                reply.send(results);
            })
            .catch(error => {
                reply.send(error);
            });
    });
};
