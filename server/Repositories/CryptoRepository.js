import BlockChairRepository from "./Cryptocurrencies/BlockChairRepository";
import RippleRepository from "./Cryptocurrencies/RippleRepository";
import TangleRepository from "./Cryptocurrencies/TangleRepository";

export default class CryptoRepository {
    constructor() {
        this.cache = {};

        // cache for X seconds
        this.cacheDuration = 1000 * 60 * 3;

        // setup repositories for each crypto currency type
        this.blockChairBitcoinRepositroy = new BlockChairRepository("BTC");
        this.blockChairEthereumRepositroy = new BlockChairRepository("ETH");
        this.blockChairLitecoinRepositroy = new BlockChairRepository("LTC");
        this.tangleRepository = new TangleRepository();
        this.rippleRepository = new RippleRepository();
    }

    getBalance = async (inputCurrency, address) => {
        const currency = this.currencyTypeParser(inputCurrency);
        const repository = this.getRepository(currency);

        const cacheKey = `${currency}:${address}`;
        const currentTime = new Date().getTime();

        if (this.cache[cacheKey]) {
            const cacheInfo = this.cache[cacheKey];

            // check if still valid
            if (cacheInfo.expires > currentTime) return cacheInfo;
        }

        // fetch updated information
        const balanceResult = await repository.getBalance(address);

        // update cache info
        this.cache[cacheKey] = {
            address: address,
            currency: currency,
            updated: currentTime,
            expires: currentTime + this.cacheDuration,
            data: balanceResult
        };

        return this.cache[cacheKey];
    };

    // TODO
    // getTransactions = (currency, address) => {}
    // getPrice = (currency) => {}

    /**
     * Get the correct repository for each type
     * @param currency
     * @returns {BlockChairRepository|RippleRepository|TangleRepository}
     */
    getRepository(currency) {
        switch (currency) {
            case "BTC":
                return this.blockChairBitcoinRepositroy;
            case "ETH":
                return this.blockChairEthereumRepositroy;
            case "LTC":
                return this.blockChairLitecoinRepositroy;
            case "IOTA":
                return this.tangleRepository;
            case "XRP":
                return this.rippleRepository;
        }
    }

    /**
     * Normalizes input currency values
     * @param currency
     * @returns {string}
     */
    currencyTypeParser(currency) {
        const upperCase = currency.toUpperCase();
        switch (upperCase) {
            case "BITCOIN":
                return "BTC";
            case "ETHER":
            case "ETHEREUM":
                return "ETH";
            case "LITECOIN":
                return "LTC";
            case "MIOTA":
                return "IOTA";
            case "RIPPLE":
                return "XRP";
        }
        return upperCase;
    }
}
