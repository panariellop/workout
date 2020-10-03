const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
    },
		program_links: {
				type: Map,
				required: false, 
		}
});

module.exports = mongoose.model("user", userSchema); 
