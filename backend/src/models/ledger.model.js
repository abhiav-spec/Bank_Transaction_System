const mongoose = require('mongoose');

const ledgerschema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, "Account reference is required"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        immutable: true
    },
    transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: [true, "Transaction reference is required"],
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ['debit', 'credit'],
            message: "Type must be either debit or credit",
        },
        required: [true, "Type is required"],
        immutable: true
    }
},{
    timestamps: true    
});

function preventLedgerModification(next) {
    next(new Error("Ledger entries cannot be modified or deleted"));
}

ledgerschema.pre('updateOne', preventLedgerModification);
ledgerschema.pre('deleteOne', preventLedgerModification);
ledgerschema.pre('deleteMany', preventLedgerModification);
ledgerschema.pre('findOneAndUpdate', preventLedgerModification);
ledgerschema.pre('findOneAndDelete', preventLedgerModification);

const ledgerModel = mongoose.model('Ledger', ledgerschema);
module.exports = ledgerModel;   