const mongoose = require('mongoose');

const telegramUserSchema = new mongoose.Schema({
    telegramId: Number,
    name: String,
    username: String,
    type: String,
});

const TelegramUser = mongoose.model('TelegramUser', telegramUserSchema);

module.exports = TelegramUser;