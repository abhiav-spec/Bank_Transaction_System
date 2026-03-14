const accountModel = require('../models/account.model');

function normalizeString(value) {
    return String(value || '').trim();
}

function normalizeEmail(value) {
    return normalizeString(value).toLowerCase();
}

function validateAadhaarNumber(aadhaarNumber) {
    return /^\d{12}$/.test(aadhaarNumber);
}

async function createAccountDetailsController(req, res) {
    try {
        const userId = req.user._id;

        const personalDetails = req.body?.personalDetails || {};
        const identityDetails = req.body?.identityDetails || {};
        const accountDetails = req.body?.accountDetails || {};
        const confirmation = req.body?.confirmation || {};

        const fullName = normalizeString(personalDetails.fullName);
        const email = normalizeEmail(personalDetails.email);
        const nationality = normalizeString(personalDetails.nationality);

        const aadhaarNumber = normalizeString(identityDetails.aadhaarNumber);

        const currency = normalizeString(accountDetails.currency || 'INR').toUpperCase();
        const accountType = normalizeString(accountDetails.accountType).toLowerCase();

        const isConfirmed = confirmation.isConfirmed === true;

        if (!fullName || !email || !nationality) {
            return res.status(400).json({
                message: "fullName, email and nationality are required in personalDetails",
                status: false,
            });
        }

        if (!aadhaarNumber) {
            return res.status(400).json({
                message: "aadhaarNumber is required in identityDetails",
                status: false,
            });
        }

        if (!validateAadhaarNumber(aadhaarNumber)) {
            return res.status(400).json({
                message: "Aadhaar number must be exactly 12 digits",
                status: false,
            });
        }

        if (!accountType) {
            return res.status(400).json({
                message: "accountType is required in accountDetails",
                status: false,
            });
        }

        if (!['savings', 'current'].includes(accountType)) {
            return res.status(400).json({
                message: "accountType must be either savings or current",
                status: false,
            });
        }

        if (!isConfirmed) {
            return res.status(400).json({
                message: "Please confirm details in confirmation step before creating account",
                status: false,
            });
        }

        const aadhaarAccountCount = await accountModel.countDocuments({ aadhaarNumber });
        if (aadhaarAccountCount >= 3) {
            return res.status(400).json({
                message: "Maximum 3 accounts allowed per Aadhaar number.",
                status: false,
            });
        }

        const duplicateWindow = new Date(Date.now() - 15 * 1000);
        const duplicateAccount = await accountModel.findOne({
            user: userId,
            fullName,
            email,
            nationality,
            aadhaarNumber,
            accountType,
            currency,
            createdAt: { $gte: duplicateWindow },
        });

        if (duplicateAccount) {
            return res.status(409).json({
                message: "Duplicate account creation request.",
                status: false,
                data: duplicateAccount,
            });
        }

        const account = await accountModel.create({
            user: userId,
            status: 'active',
            fullName,
            email,
            nationality,
            aadhaarNumber,
            accountType,
            currency,
        });

        return res.status(201).json({
            message: "Account created successfully",
            status: true,
            data: account,
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({
                message: "Duplicate account creation request.",
                status: false,
            });
        }

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

async function getAccountBalanceController(req, res) {
    const accountId = req.params.accountId;
    try {
        const userId = req.user._id;
        const account = await accountModel.findOne({ _id: accountId, user: userId });

        if (!account) {
            return res.status(404).json({
                message: "Account not found",
                status: false,
            });
        }

        const balance = await account.getBalance();
        
        return res.status(200).json({
            message: "Account balance fetched successfully",
            status: true,
            data: { balance: balance }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: false,
        });
    }
}

async function getAllAccountsForSystemController(req, res) {
    try {
        const accounts = await accountModel.find({}).populate('user', 'name email');

        return res.status(200).json({
            message: "All accounts fetched successfully",
            status: true,
            data: accounts,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: false,
        });
    }
}

async function updateAccountStatusForSystemController(req, res) {
    try {
        const { accountId } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['active', 'Freeze', 'suspended'];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "status must be one of: active, Freeze, suspended",
                status: false,
            });
        }

        const account = await accountModel.findById(accountId);

        if (!account) {
            return res.status(404).json({
                message: "Account not found",
                status: false,
            });
        }

        account.status = status;
        await account.save();

        return res.status(200).json({
            message: "Account status updated successfully",
            status: true,
            data: account,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: false,
        });
    }
}

module.exports = {
    createAccountDetailsController,
    getAccountsController,
    getAccountBalanceController,
    getAllAccountsForSystemController,
    updateAccountStatusForSystemController,
};