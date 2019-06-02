import CryptoRepository from "../../Repositories/CryptoRepository";

export default (app, opts, next) => {
    const cryptoRepository = new CryptoRepository();

    app.get("/balance/:currency/:address", async (request, reply) => {
        const data = await cryptoRepository.getBalance(request.params.currency, request.params.address);

        reply.send(data);
    });

    next();
};
