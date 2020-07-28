const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    status: {
        type: String, 
        required: true,
        default: "STANDARD"
    }, 
    username: {
        type: String, 
        required: true
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
    dateRegistered: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("user", userSchema); 