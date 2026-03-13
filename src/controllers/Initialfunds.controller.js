const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const emailService = require('../services/email.service');
const mongoose = require('mongoose');

async function createInitialFundsController(req, res) {
    const { toAccount, amount, idempotencyKey, fromAccount } = req.body;

    if (!toAccount || !amount || !idempotencyKey || !fromAccount) {
        return res.status(400).json({
            message: "fromAccount, toAccount, amount, and idempotencyKey are required",
            status: false,
        });
    }

    const session = await mongoose.startSession();

    try {
        const targetAccount = await accountModel.findById(toAccount);
        const systemAccount = await accountModel.findById(fromAccount);

        if (!targetAccount || !systemAccount) {
            return res.status(404).json({
                message: "From or to account not found",
                status: false,
            });
        }

        if (targetAccount.status !== 'active' || systemAccount.status !== 'active') {
            return res.status(400).json({
                message: "Both accounts must be active",
                status: false,
            });
        }

        const existingTransaction = await transactionModel.findOne({ idempotencyKey });
        if (existingTransaction) {
            return res.status(409).json({
                message: `Transaction already ${existingTransaction.status}`,
                status: false,
                transaction: existingTransaction,
            });
        }

        session.startTransaction();

        const transaction = await transactionModel.create([{
            fromAccount: systemAccount._id,
            toAccount: targetAccount._id,
            amount,
            idempotencyKey,
            status: 'completed',
        }], { session });

        await ledgerModel.create([{
            account: systemAccount._id,
            transaction: transaction[0]._id,
            type: 'debit',
            amount,
        }], { session });

        await ledgerModel.create([{
            account: targetAccount._id,
            transaction: transaction[0]._id,
            type: 'credit',
            amount,
        }], { session });

        await session.commitTransaction();

        return res.status(200).json({
            message: "Initial funds added successfully",
            status: true,
            data: transaction[0],
        });
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        return res.status(500).json({
            message: error.message || "Internal server error",
            status: false,
        });
    } finally {
        session.endSession();
    }
}

module.exports = { createInitialFundsController, initialFundsMiddleware: createInitialFundsController };