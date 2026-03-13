const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "No token provided",
            status: false,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        req.user = user;
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                status: false,
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
            status: false,
        });
    }
}

async function systemUserMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "No token provided",
            status: false,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user || user.role !== 'system') {
            return res.status(403).json({
                message: "Access denied",
                status: false,
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
            status: false,
        });
    }
}

module.exports = { authMiddleware, systemUserMiddleware };


