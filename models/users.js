const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    studying: mongoose.Schema.Types.ObjectId,
    module: Number,
    payday: Date,
    attendance: String,
    verified: Boolean,
    grades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grades',
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;