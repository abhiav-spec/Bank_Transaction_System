const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');
const tokenblacklistModel = require('../models/tokenblacklist.model');
const { generateResetToken, hashResetToken } = require('../utils/resetToken.util');

const FORGOT_PASSWORD_SUCCESS_MESSAGE = 'If an account with that email exists, a password reset link has been sent.';


/* user registration  controllers */
async function userRegistercontroller(req, res) {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
                status: false,
            });
        }

        const existingUser = await userModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(422).json({
                message: "Email already exists",
                status: false,
            });
        }

        const user = await userModel.create({
            email,
            name,
            password
        });

        const token = jwt.sign({ id: user._id, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });

        await emailService.sendRegistrationEmail(user.email, user.name);

        return res.status(201).json({
            message: "User registered successfully",
            status: true,
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                token
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: false,
        });
    }

}


async function userLogincontroller(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                status: false
            });
        }

        const user = await userModel.findOne({ email: email.toLowerCase() }).select('+password').exec();
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: false
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
                status: false
            });
        }

        const token = jwt.sign({ id: user._id, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, { expiresIn: '1d' });
        await emailService.sendLoginEmail(user.email, user.name);
        return res.status(200).json({
            message: "User logged in successfully",
            status: true,
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                token
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: false,
        });
    }
}

const userlogoutcontroller = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).json({
            message: "No token provided",
            status: false,
        });
    }
    res.clearCookie('token');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await tokenblacklistModel.create({ token });
        return res.status(200).json({
            message: "User logged out successfully",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            status: false,
        });
    }

}

async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required',
                status: false,
            });
        }

        const user = await userModel.findOne({ email: email.toLowerCase().trim() }).select('+resetPasswordToken +resetPasswordExpire');

        if (user) {
            const resetToken = generateResetToken();
            const hashedToken = hashResetToken(resetToken);
            const resetPasswordExpire = Date.now() + 15 * 60 * 1000;

            user.resetPasswordToken = hashedToken;
            user.resetPasswordExpire = resetPasswordExpire;
            await user.save({ validateBeforeSave: false });

            const resetBaseUrl = process.env.PASSWORD_RESET_URL || process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:3000';
            const resetLink = `${resetBaseUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;
            await emailService.sendPasswordResetEmail(user.email, user.name, resetLink);
        }

        return res.status(200).json({
            message: FORGOT_PASSWORD_SUCCESS_MESSAGE,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Internal server error',
            status: false,
        });
    }
}

async function resetPasswordController(req, res) {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                message: 'Token and newPassword are required',
                status: false,
            });
        }

        if (String(newPassword).length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long',
                status: false,
            });
        }

        const hashedToken = hashResetToken(token);

        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        }).select('+resetPasswordToken +resetPasswordExpire +password tokenVersion');

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset token',
                status: false,
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userModel.updateOne(
            { _id: user._id },
            {
                $set: {
                    password: hashedPassword,
                    tokenVersion: (user.tokenVersion || 0) + 1,
                },
                $unset: {
                    resetPasswordToken: 1,
                    resetPasswordExpire: 1,
                },
            }
        );

        return res.status(200).json({
            message: 'Password reset successfully',
            status: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Internal server error',
            status: false,
        });
    }
}

async function setTransactionPinController(req, res) {
    try {
        const { transactionPassword } = req.body;

        if (!transactionPassword) {
            return res.status(400).json({
                message: 'transactionPassword is required',
                status: false,
            });
        }

        if (!/^\d{4,6}$/.test(String(transactionPassword))) {
            return res.status(400).json({
                message: 'transactionPassword must be 4 to 6 digits',
                status: false,
            });
        }

        const user = await userModel.findById(req.user._id).select('+transactionPin');

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                status: false,
            });
        }

        if (user.transactionPin) {
            return res.status(409).json({
                message: 'Transaction password already set. Use update endpoint.',
                status: false,
            });
        }

        const hashedPin = await bcrypt.hash(String(transactionPassword), 10);

        await userModel.updateOne(
            { _id: user._id },
            { $set: { transactionPin: hashedPin } }
        );

        return res.status(200).json({
            message: 'Transaction password set successfully',
            status: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Internal server error',
            status: false,
        });
    }
}

async function updateTransactionPinController(req, res) {
    try {
        const { currentTransactionPassword, newTransactionPassword } = req.body;

        if (!currentTransactionPassword || !newTransactionPassword) {
            return res.status(400).json({
                message: 'currentTransactionPassword and newTransactionPassword are required',
                status: false,
            });
        }

        if (!/^\d{4,6}$/.test(String(newTransactionPassword))) {
            return res.status(400).json({
                message: 'newTransactionPassword must be 4 to 6 digits',
                status: false,
            });
        }

        const user = await userModel.findById(req.user._id).select('+transactionPin');

        if (!user || !user.transactionPin) {
            return res.status(404).json({
                message: 'Transaction password is not set',
                status: false,
            });
        }

        const isCurrentPinValid = await bcrypt.compare(String(currentTransactionPassword), user.transactionPin);

        if (!isCurrentPinValid) {
            return res.status(401).json({
                message: 'Current transaction password is incorrect',
                status: false,
            });
        }

        const hashedPin = await bcrypt.hash(String(newTransactionPassword), 10);

        await userModel.updateOne(
            { _id: user._id },
            { $set: { transactionPin: hashedPin } }
        );

        return res.status(200).json({
            message: 'Transaction password updated successfully',
            status: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Internal server error',
            status: false,
        });
    }
}

module.exports = {
    userRegistercontroller,
    userLogincontroller,
    userlogoutcontroller,
    forgotPasswordController,
    resetPasswordController,
    setTransactionPinController,
    updateTransactionPinController,
};
