import BlockChairRepository from "./Cryptocurrencies/BlockChairRepository";
import RippleRepository from "./Cryptocurrencies/RippleRepository";
import TangleRepository from "./Cryptocurrencies/TangleRepository";

export default class CryptoRepository {
    getBalance = (currency, address) => {
        const client = this.getClient(currency);

        return client.getBalance(address);
    };

    getClient(currency) {
        const fixedCurrency = this.currencyTypeParser(currency);

        switch (fixedCurrency) {
            case "BTC":
            case "ETH":
            case "LTC":
                return new BlockChairRepository(fixedCurrency);
            case "IOTA":
                return new TangleRepository();
            case "XRP":
                return new RippleRepository();
        }
    }

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

    // TODO
    // getTransactions = (currency, address) => {}
    // getPrice = (currency) => {}
}
