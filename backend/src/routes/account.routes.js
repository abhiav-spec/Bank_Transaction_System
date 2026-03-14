const express = require('express');
const router = express.Router();
const {
	createAccountDetailsController,
	getAccountsController,
	getAccountBalanceController,
	getAllAccountsForSystemController,
	updateAccountStatusForSystemController,
} = require('../controllers/account.controller');
const { authMiddleware, systemUserMiddleware } = require('../middleware/auth.middleware');



router.get('/', authMiddleware, getAccountsController);
router.post('/', authMiddleware, createAccountDetailsController);
router.get('/balance/:accountId', authMiddleware, getAccountBalanceController);
router.get('/system/all', systemUserMiddleware, getAllAccountsForSystemController);
router.patch('/system/:accountId/status', systemUserMiddleware, updateAccountStatusForSystemController);

module.exports = router;