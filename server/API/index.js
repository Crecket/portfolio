const CryptoCurrencies = require("./CryptoCurrencies");

module.exports = app => {
    app.get("/api", (request, reply) => {
        reply.send("alive");
    });

    CryptoCurrencies(app);
};
