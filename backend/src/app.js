const express = require('express');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const accountRoutes = require('./routes/account.routes');
const transactionRoutes = require('./routes/transaction.routes');
const cors = require('cors');


const app = express();
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options(/.*/, cors({
    origin: allowedOrigin,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/reset-password', (req, res) => {
    const token = req.query.token;
    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!token) {
        return res.status(400).json({
            message: 'Reset token is required',
            status: false,
        });
    }

    const redirectUrl = `${frontendBaseUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;
    return res.redirect(302, redirectUrl);
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to Bank Transaction System API",
        status: true,
    });
});
module.exports = app;

 