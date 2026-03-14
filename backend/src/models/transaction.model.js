const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, "From account reference is required"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, "To account reference is required"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'failed','reversed'],
            message: "Status must be either pending, completed or failed",
        },
        default: 'pending',
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0.01, "Amount must be at least 0.01"],
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required"],
        unique: true,
        index: true
    },
},{
    timestamps: true    
});

const transactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = transactionModel;