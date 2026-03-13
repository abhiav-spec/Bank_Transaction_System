const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const emailService = require('../services/email.service');
const mongoose = require('mongoose');

async function createTransactionController(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required",
            status: false,
        });
    }

    const session = await mongoose.startSession();

    try {
        const fromUserAccount = await accountModel.findById(fromAccount).populate('user');
        const toUserAccount = await accountModel.findById(toAccount).populate('user');

        if (!fromUserAccount || !toUserAccount) {
            return res.status(404).json({
                message: "From or To account not found",
                status: false,
            });
        }

        const existingTransaction = await transactionModel.findOne({ idempotencyKey });
        if (existingTransaction) {
            return res.status(409).json({
                message: `Transaction already ${existingTransaction.status}`,
                status: false,
                transaction: existingTransaction
            });
        }

        if (fromUserAccount.status !== 'active' || toUserAccount.status !== 'active') {
            return res.status(400).json({
                message: "Both accounts must be active",
                status: false,
            });
        }

        const balanceCheck = await fromUserAccount.getBalance();
        if (balanceCheck < Number(amount)) {
            return res.status(400).json({
                message: "Insufficient balance in from account",
                status: false,
            });
        }

        session.startTransaction();

        const transaction = await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: 'pending'
        }], { session });

        await ledgerModel.create([{
            account: fromAccount,
            type: 'debit',
            amount,
            transaction: transaction[0]._id
        }], { session });

        await ledgerModel.create([{
            account: toAccount,
            type: 'credit',
            amount,
            transaction: transaction[0]._id
        }], { session });

        transaction[0].status = 'completed';
        await transaction[0].save({ session });

        await session.commitTransaction();

        await emailService.sendTransactionEmail(
            fromUserAccount.user?.email,
            fromUserAccount.user?.name || 'User',
            amount,
            fromAccount,
            toAccount
        );
        await emailService.sendTransactionEmail(
            toUserAccount.user?.email,
            toUserAccount.user?.name || 'User',
            amount,
            fromAccount,
            toAccount
        );

        return res.status(201).json({
            message: "Transaction created successfully",
            status: true,
            transaction: transaction[0]
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

async function getTransactionsController(req, res) {
    try {
        const userId = req.user._id;
        const accounts = await accountModel.find({ user: userId }).select('_id');
        const accountIds = accounts.map((account) => account._id);

        const transactions = await transactionModel.find({
            $or: [
                { fromAccount: { $in: accountIds } },
                { toAccount: { $in: accountIds } }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Transactions fetched successfully",
            status: true,
            data: transactions,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: false,
        });
    }
}

module.exports = {
    createTransactionController,
    getTransactionsController,
};