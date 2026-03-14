const express = require('express');
const router = express.Router();
const {
	userRegistercontroller,
	userLogincontroller,
	userlogoutcontroller,
	forgotPasswordController,
	resetPasswordController,
} = require('../controllers/auth.controller');
const { forgotPasswordRateLimiter } = require('../utils/rateLimit.util');

router.post('/register', userRegistercontroller);

router.post('/login', userLogincontroller);

router.post('/logout',userlogoutcontroller);

router.post('/forgot-password', forgotPasswordRateLimiter(), forgotPasswordController);

router.post('/reset-password', resetPasswordController);

module.exports = router;


