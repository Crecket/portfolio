import CryptoCurrencies from "./CryptoCurrencies";

export default app => {
    app.get("/api", (request, reply) => {
        reply.send("alive");
    });

    CryptoCurrencies(app);
};
