const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');


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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
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

module.exports = {
    userRegistercontroller,
    userLogincontroller
}
