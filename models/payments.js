const mongoose = require('mongoose');

const paymentsSchema = new mongoose.Schema({
    email: String,
    is_registration: Boolean,
    course: String,
    amount: Number,
    ref_number: Number,
    verified: Boolean,
});

const Payments = mongoose.model('Payments', paymentsSchema);

module.exports = Payments;