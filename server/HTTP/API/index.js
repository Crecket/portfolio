import Cryptocurrencies from "./Cryptocurrencies";

export default (app, opts, next) => {
    app.register(Cryptocurrencies, { prefix: "/cryptocurrencies" });

    next();
};
