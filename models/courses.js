const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: String,
    modules: Number,
    price: String,
    modality: String,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;