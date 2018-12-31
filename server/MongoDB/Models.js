const mongoose = require("mongoose");

export default () => {
    const Schema = mongoose.Schema;
    const ObjectId = Schema.ObjectId;

    const WalletSchema = Schema(
        {
            _id: ObjectId,
            address: String,
            currency: String,
            amount: String,
            createdAt: { type : Date, default: Date.now },
            updatedAt: { type : Date, default: Date.now }
        },
        {
            toJSON: {
                transform: (doc, ret) => {
                    delete ret.__v;
                }
            }
        }
    );

    const TransactionSchema = Schema(
        {
            _id: ObjectId,
            addressTo: String,
            addressFrom: String,
            currency: String,
            amount: Number,
            createdAt: { type : Date, default: Date.now },
            updatedAt: { type : Date, default: Date.now }
        },
        {
            toJSON: {
                transform: (doc, ret) => {
                    delete ret.__v;
                }
            }
        }
    );

    mongoose.model("Wallet", WalletSchema);
    mongoose.model("Transaction", TransactionSchema);
};
