const mongoose = require("mongoose");

class WalletDatabaseRepository {
    constructor() {
        this.model = mongoose.model("Wallet");
    }

    get(address) {
        return this.model.findOne({ address: address });
    }

    save(address, currency, amount) {
        const Wallet = new this.model();
        Wallet._id = mongoose.Types.ObjectId();
        Wallet.address = address;
        Wallet.currency = currency;
        Wallet.amount = amount;

        return Wallet.save();
    }
}

export default WalletDatabaseRepository;
