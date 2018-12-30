const mongoose = require("mongoose");

class WalletDatabaseRepository {
    constructor() {
        this.model = mongoose.model("Wallet");
    }

    get(address) {
        return this.model.findOne({ address: address });
    }
    list() {}
}

module.exports = WalletDatabaseRepository;
