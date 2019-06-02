import axios from "axios";

export default class TangleRepository {
    getBalance = async address => {
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
