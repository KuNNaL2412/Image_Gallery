// image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    data: {
        type: Buffer,
        required: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
    },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
