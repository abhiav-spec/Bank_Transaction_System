const express = require('express');
const router = express.Router();
const { createAccountDetailsController, getAccountsController , getAccountBalanceController} = require('../controllers/account.controller');
const { authMiddleware } = require('../middleware/auth.middleware');



router.get('/', authMiddleware, getAccountsController);
router.post('/', authMiddleware, createAccountDetailsController);
router.get('/balance/:accountId', authMiddleware, getAccountBalanceController);

module.exports = router;