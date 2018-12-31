import axios from "axios";

const divideByValue = Math.pow(10, 18);

class EtherScanApiRepository {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async getBalance(address) {
        const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${
            this.apiKey
        }`;

        const apiResponse = await axios.get(url).then(response => response.data);
        if (!apiResponse) return false;

        return {
            address: address,
            currency: "ETH",
            amount: parseFloat(apiResponse.result) / divideByValue
        };
    }

    // async getTransactions(address) {
    //     const url = `http://api.etherscan.io/api?module=account&action=tokentx&address=${address}&sort=asc&apikey=${
    //         this.apiKey
    //     }`;
    //
    //     return axios.get(url).then(response => response.data);
    // }
}

export default EtherScanApiRepository;
