const express = require('express');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const accountRoutes = require('./routes/account.routes');
const transactionRoutes = require('./routes/transaction.routes');


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to Bank Transaction System API",
        status: true,
    });
});
module.exports = app;

 