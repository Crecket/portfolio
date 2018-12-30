const mongoose = require("mongoose");

module.exports = () => {
    const Schema = mongoose.Schema;
    const ObjectId = Schema.ObjectId;

    mongoose.model(
        "Wallet",
        Schema({
            _id: ObjectId,
            address: String,
            currency: String,
            timestamps: {}
        })
    );

    mongoose.model(
        "Transaction",
        Schema({
            _id: ObjectId,
            addressTo: String,
            addressFrom: String,
            currency: String,
            amount: Number,
            timestamps: {}
        })
    );
};
