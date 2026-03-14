const forgotPasswordRequests = new Map();

function forgotPasswordRateLimiter({ windowMs = 15 * 60 * 1000, max = 5 } = {}) {
    return function rateLimiter(req, res, next) {
        const email = String(req.body?.email || '').toLowerCase().trim();
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown-ip';
        const key = `${ip}:${email || 'no-email'}`;
        const now = Date.now();

        const entry = forgotPasswordRequests.get(key);

        if (!entry || now > entry.resetAt) {
            forgotPasswordRequests.set(key, {
                count: 1,
                resetAt: now + windowMs,
            });
            return next();
        }

        if (entry.count >= max) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
            return res.status(429).json({
                message: 'Too many forgot password requests. Please try again later.',
                status: false,
                retryAfter,
            });
        }

        entry.count += 1;
        forgotPasswordRequests.set(key, entry);
        next();
    };
}

module.exports = {
    forgotPasswordRateLimiter,
};
