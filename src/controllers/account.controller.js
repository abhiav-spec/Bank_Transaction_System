const accountModel = require('../models/account.model');


async function createAccountDetailsController(req, res) {
    try {
        const userId = req.user._id;
        const { currency } = req.body;

        if (!currency) {
            return res.status(400).json({
                message: "Currency is required",
                status: false,
            });
        }

        const account = await accountModel.create({
            user: userId,
            status: 'active',
            currency: currency.toUpperCase(),
        });
        return res.status(201).json({
            message: "Account created successfully",
            status: true,
            data: account
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const firstError = Object.values(error.errors)[0];
            return res.status(400).json({
                message: firstError?.message || 'Validation failed',
                status: false,
            });
        }

        return res.status(500).json({
            message: error.message || "Internal server error",
            status: false,
        });
    }
}

async function getAccountsController(req, res) {
    try {
        const userId = req.user._id;
        const accounts = await accountModel.find({ user: userId });
        return res.status(200).json({
            message: "Accounts fetched successfully",
            status: true,
            data: accounts
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: false,
        });
    }
}

module.exports = { createAccountDetailsController, getAccountsController };