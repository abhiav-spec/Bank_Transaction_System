const mongoose = require('mongoose');
const ledgermodel = require('./ledger.model');
const transactionModel = require('./transaction.model');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User reference is required"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'Freeze', 'suspended'],
            message: "Status must be either active, Freeze or suspended",
        },
        default: 'active',
    },

    currency:{
        type: String,
        required: [true, "Currency is required"],
        trim: true,
         match: [/^[A-Z]{3}$/, "Currency must be a 3-letter ISO code"]
     },

    
},{
    timestamps: true
});

accountSchema.index({ user: 1 , status: 1});

accountSchema.methods.getBalance = async function() {
    const credits = await ledgermodel.aggregate([
        { $match: { account: this._id, type: 'credit' } },
        { $group: { _id: null, totalCredits: { $sum: '$amount' } } }
    ]);

    const debits = await ledgermodel.aggregate([
        { $match: { account: this._id, type: 'debit' } },
        { $group: { _id: null, totalDebits: { $sum: '$amount' } } }
    ]);

    const totalCredits = credits[0]?.totalCredits || 0;
    const totalDebits = debits[0]?.totalDebits || 0;

    return totalCredits - totalDebits;
}

const accountModel = mongoose.model('Account', accountSchema);  
module.exports = accountModel;