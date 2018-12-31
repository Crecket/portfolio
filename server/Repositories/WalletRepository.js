import WalletDatabaseRepository from "./Database/WalletDatabaseRepository";
import EtherScanApiRepository from "./API/EtherScanApiRepository";
// import NeoTrackerApiRepository from "./API/NeoTrackerApiRepository";
// import RippleApiRepository from "./API/RippleApiRepository";

class WalletRepository {
    constructor() {
        this.walletDatabaseRepository = new WalletDatabaseRepository();

        this.etherScanApiRepository = new EtherScanApiRepository();
        // this.neoTrackerApiRepository = new NeoTrackerApiRepository();
        // this.rippleApiRepository = new RippleApiRepository();
    }

    async get(address, currency = false) {
        const databaseResult = await this.walletDatabaseRepository.get(address);

        if (databaseResult) {
            return databaseResult;
        }

        // get the correct api handler for the currency
        let apiPromise = null;
        switch (currency) {
            case "ETH":
                apiPromise = this.etherScanApiRepository.getBalance(address);
                break;
            default:
                return null;
        }
        const apiResponse = await apiPromise;

        if (apiResponse) {
            await this.walletDatabaseRepository.save(apiResponse.address, apiResponse.currency, apiResponse.amount);
        }

        return this.walletDatabaseRepository.get(address);
    }

    list() {}
}

export default WalletRepository;
