import axios from "axios";
const AddressValidator = require("wallet-address-validator");

export default class RippleRepository {
    validateAddress(address) {
        return AddressValidator.validate(address, "XRP");
    }

    getBalance = async address => {
        if (!this.validateAddress(address)) throw new Error("Invalid address given");

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
                balanceObject.balance = parseFloat(xrpBalance.value);
            }
        } catch (error) {}

        return balanceObject;
    };
}
