const mongoose = require("mongoose");

class WalletDatabaseRepository {
    constructor() {
        this.model = mongoose.model("Wallet");
    }

    get(id) {
        return this.model.findById(id);
    }

    list() {
        return this.model.find();
    }

    save(walletDetails) {
        const Wallet = new this.model();
        Object.keys(walletDetails).forEach(key => {
            const value = walletDetails[key];

            Wallet[key] = value;
        });

        if (!Wallet._id) {
            Wallet._id = mongoose.Types.ObjectId();
        }
        if (!Wallet.createdAt) {
            Wallet.createdAt = new Date();
        }

        // set updatedAt timestamp
        Wallet.updatedAt = new Date();

        return Wallet.save();
    }
}

export default WalletDatabaseRepository;
