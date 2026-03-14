const express = require('express');
const router = express.Router();
const {
	userRegistercontroller,
	userLogincontroller,
	userlogoutcontroller,
	forgotPasswordController,
	resetPasswordController,
	setTransactionPinController,
	updateTransactionPinController,
} = require('../controllers/auth.controller');
const { forgotPasswordRateLimiter } = require('../utils/rateLimit.util');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/register', userRegistercontroller);

router.post('/login', userLogincontroller);

router.post('/logout',userlogoutcontroller);

router.post('/forgot-password', forgotPasswordRateLimiter(), forgotPasswordController);

router.post('/reset-password', resetPasswordController);

router.post('/transaction-password/set', authMiddleware, setTransactionPinController);

router.post('/transaction-password/update', authMiddleware, updateTransactionPinController);

module.exports = router;


