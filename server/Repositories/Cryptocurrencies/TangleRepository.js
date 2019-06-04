import axios from "axios";
import { isAddress } from "@iota/validators";

export default class TangleRepository {
    validateAddress(address) {
        return isAddress(address);
    }

    getBalance = async address => {
        if (!this.validateAddress(address)) throw new Error("Invalid address given");

        const balanceObject = {
            balance: 0,
            transactionCount: 0,
            transactions: []
        };

        try {
            // call the tangle API
            const response = await axios.get(`https://api.thetangle.org/addresses/${address}`);
            const responseData = response.data;

            // check response details
            if (responseData) {
                // transaction information
                balanceObject.transactions = responseData.transactions;
                balanceObject.transactionCount = responseData.totalTransactions;

                // get the address balance
                balanceObject.balance = responseData.balance > 0 ? responseData.balance / 1000000 : 0;
            }
        } catch (error) {}

        return balanceObject;
    };
}
