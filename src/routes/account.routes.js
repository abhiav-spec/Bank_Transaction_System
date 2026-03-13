const express = require('express');
const router = express.Router();
const { createAccountDetailsController, getAccountsController } = require('../controllers/account.controller');
const { authMiddleware } = require('../middleware/auth.middleware');



router.get('/', authMiddleware, getAccountsController);
router.post('/', authMiddleware, createAccountDetailsController);

module.exports = router;