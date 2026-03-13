const { Router } = require('express');
const router = Router();
const { createTransactionController, getTransactionsController } = require('../controllers/transaction.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { createInitialFundsController } = require('../controllers/initialfunds.controller');

router.get('/', authMiddleware, getTransactionsController);
router.post('/', authMiddleware, createTransactionController);
router.post('/system/initial-funds', authMiddleware, createInitialFundsController);

module.exports = router;
