const axios = require("axios");

class EtherScanApiRepository {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    getBalance(address) {
        const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${
            this.apiKey
        }`;

        return axios.get(url).then(response => response.data);
    }

    getTransactions(address) {
        const url = `http://api.etherscan.io/api?module=account&action=tokentx&address=${address}&sort=asc&apikey=${
            this.apiKey
        }`;

        return axios.get(url).then(response => response.data);
    }
}

module.exports = EtherScanApiRepository;
