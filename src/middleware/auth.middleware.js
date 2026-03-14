const userModel = require('../models/user.model');
const tokenblacklistModel = require('../models/tokenblacklist.model');
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
const isbalacklisted = await tokenblacklistModel.findOne({ token });
    if (isbalacklisted) {
        return res.status(401).json({
            message: "Token is blacklisted",
            status: false,
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password tokenVersion');
        req.user = user;
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                status: false,
            });
        }
        if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
            return res.status(401).json({
                message: "Session expired. Please login again",
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
const isbalacklisted = await tokenblacklistModel.findOne({ token });
    if (isbalacklisted) {
        return res.status(401).json({
            message: "Token is blacklisted",
            status: false,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password +systemUser tokenVersion');
        if (!user || !user.systemUser) {
            return res.status(403).json({
                message: "Only system users can access this resource",
                status: false,
            });
        }
        if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
            return res.status(401).json({
                message: "Session expired. Please login again",
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


