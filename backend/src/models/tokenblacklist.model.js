const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required'],
        unique: true,
        index: true,
    },
}, {
    timestamps: true,
});

tokenBlacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

const tokenblacklistModel = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

module.exports = tokenblacklistModel;
