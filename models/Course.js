const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentsEnrolled: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }

},{timestamps: true});

module.exports = mongoose.model('Course', courseSchema);