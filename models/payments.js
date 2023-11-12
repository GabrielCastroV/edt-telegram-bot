const mongoose = require('mongoose');

const pagoMovilSchema = new mongoose.Schema({
    email: String,
    course: String,
    modality: String,
    module: Number,
    payday: Date,
    module_price: Number,
    amount: Number,
    ref_number: Number,
    verified: Boolean,
});

const PagoMovil = mongoose.model('PagoMovil', pagoMovilSchema);

const registrationSchema = new mongoose.Schema({
    order_id: String,
    username: String,
    first_name: String,
    currency: String,
    total: Number,
    course: String,
    name: String,
    email: String,
    phone: String,
    verified: Boolean,
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = {
    PagoMovil,
    Registration,
};