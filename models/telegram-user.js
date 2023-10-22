const mongoose = require('mongoose');

const telegramUserSchema = new mongoose.Schema({
    telegramId: Number,
    name: String,
    username: String,
    type: String,
});

const TelegramUser = mongoose.model('Telegram-User', telegramUserSchema);

module.exports = TelegramUser;