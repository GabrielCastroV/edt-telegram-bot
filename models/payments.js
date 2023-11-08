const mongoose = require('mongoose');

const paymentsSchema = new mongoose.Schema({
    email: String,
    course: String,
    amount: Number,
    verified: Boolean,

});

const Payments = mongoose.model('Payments', paymentsSchema);

module.exports = Payments;