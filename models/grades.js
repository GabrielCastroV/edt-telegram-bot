const mongoose = require('mongoose');

const gradesSchema = new mongoose.Schema({
    module: Number,
    grade: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Grades = mongoose.model('Grades', gradesSchema);

module.exports = Grades;