import WalletDatabaseRepository from "./Database/WalletDatabaseRepository";
import EtherScanApiRepository from "./API/EtherScanApiRepository";
// import NeoTrackerApiRepository from "./API/NeoTrackerApiRepository";
// import RippleApiRepository from "./API/RippleApiRepository";

const cacheTime = 1000 * 60 * 60;

class WalletRepository {
    constructor() {
        this.walletDatabaseRepository = new WalletDatabaseRepository();

        this.etherScanApiRepository = new EtherScanApiRepository();
        // this.neoTrackerApiRepository = new NeoTrackerApiRepository();
        // this.rippleApiRepository = new RippleApiRepository();
    }

    get(id) {
        return this.walletDatabaseRepository.get(id);
    }

    list() {
        return this.walletDatabaseRepository.list();
    }

    async save(address, currency = false) {
        const databaseResult = await this.walletDatabaseRepository.get(address);

        if (databaseResult && databaseResult.updatedAt) {
            const updatedDate = databaseResult.updatedAt.getTime();
            const nowDate = new Date().getTime();
            const timeUntilExpire = nowDate - cacheTime - updatedDate;

            if (timeUntilExpire < 0) {
                return databaseResult;
            }
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
        let apiResponse = await apiPromise;

        if (apiResponse) {
            // merge existing with new api data
            if (databaseResult) {
                apiResponse = {
                    ...databaseResult,
                    ...apiResponse
                };
            }

            return this.walletDatabaseRepository.save(apiResponse);
        }

        return null;
    }
}

export default WalletRepository;
