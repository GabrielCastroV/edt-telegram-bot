const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    studying: mongoose.Schema.Types.ObjectId,
    module: Number,
    payday: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;