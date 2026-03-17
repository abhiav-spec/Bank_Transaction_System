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
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minlength: [2, "Full name must be at least 2 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^.+@(?:[\w-]+\.)+\w+$/, "Please enter a valid email address"],
    },
    nationality: {
        type: String,
        required: [true, "Nationality is required"],
        trim: true,
    },
    aadhaarNumber: {
        type: String,
        required: [true, "Aadhaar number is required"],
        trim: true,
        match: [/^\d{12}$/, "Aadhaar number must be exactly 12 digits"],
        index: true,
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (E.164 format or 10+ digits)"],
        index: true,
    },

    currency:{
        type: String,
        required: [true, "Currency is required"],
        default: 'INR',
        trim: true,
         match: [/^[A-Z]{3}$/, "Currency must be a 3-letter ISO code"]
    },
    accountType: {
        type: String,
        required: [true, "Account type is required"],
        enum: {
            values: ['savings', 'current'],
            message: "Account type must be either savings or current",
        },
        trim: true,
        lowercase: true,
    },

    
},{
    timestamps: true
});

accountSchema.index({ user: 1 , status: 1});
accountSchema.index({ user: 1, aadhaarNumber: 1, accountType: 1, currency: 1 });

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