const axios = require("axios");

class RippleApiRepository {
    constructor() {
    }

    // https://developers.ripple.com/data-api.html
    getBalance(address) {
        const url = `https://data.ripple.com/v2/accounts/${address}/balances`;

        return axios.get(url).then(response => response.data);
    }
}

module.exports = RippleApiRepository;
