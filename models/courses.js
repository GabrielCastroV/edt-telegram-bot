const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: String,
    modules: Number,
    modality: String,
    module_price: String,
    registration_price: String,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;