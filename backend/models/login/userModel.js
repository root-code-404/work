const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: Number,
        required: true, // 0 - admin, 1 - user, 2 - moderator
    },
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
