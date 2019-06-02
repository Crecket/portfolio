import axios from "axios";

export default class RippleRepository {
    getBalance = async address => {
        const balanceObject = {
            balance: 0
        };

        try {
            // call the ripple API
            const response = await axios.get(`https://data.ripple.com/v2/accounts/${address}/balances`);
            const responseData = response.data;

            const xrpBalance = responseData.balances.find(balanceItem => {
                return balanceItem.currency === "XRP";
            });

            if (xrpBalance) {
                balanceObject.balance = xrpBalance.value;
            }
        } catch (error) {}

        return balanceObject;
    };
}
