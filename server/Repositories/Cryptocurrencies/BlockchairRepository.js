import axios from "axios";
const AddressValidator = require("wallet-address-validator");

export default class BlockchairRepository {
    constructor(currency) {
        this.currency = currency;
        this.chainName = this.getChainName(currency);
    }

    getChainName(currency) {
        switch (currency) {
            case "BTC":
                return "bitcoin";
            case "ETH":
                return "ethereum";
            case "LTC":
                return "litecoin";
        }
    }

    validateAddress(address) {
        return AddressValidator.validate(address, this.currency);
    }

    getBalance = async address => {
        if (!this.validateAddress(address)) throw new Error("Invalid address given");

        const balanceObject = {
            balance: 0,
            transactionCount: 0,
            transactionIds: []
        };

        try {
            // call the blockchair API
            const response = await axios.get(
                `http://api.blockchair.com/${this.chainName}/dashboards/address/${address}`
            );
            const responseData = response.data;

            // check response details
            const blockChairData = responseData.data;
            const walletData = blockChairData[address];
            if (walletData) {
                // transaction information
                balanceObject.transactionCount = walletData.transactions.length;
                balanceObject.transactionIds = walletData.transactions;

                // get the address balance
                const addressDetails = walletData.address;
                balanceObject.balance = addressDetails.balance > 0 ? addressDetails.balance / 100000000 : 0;
            }
        } catch (error) {}

        return balanceObject;
    };
}
