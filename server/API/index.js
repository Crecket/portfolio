import CryptoCurrencies from "./CryptoCurrencies";

export default app => {
    app.get("/api", (request, reply) => {
        reply.send("alive");
    });

    app.get("/api/speed", (request, reply) => {
        reply.send({ success: "ok" });
    });

    CryptoCurrencies(app);
};
