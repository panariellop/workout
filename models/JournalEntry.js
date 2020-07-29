const mongoose = require('mongoose');

const JournalEntrySchema = mongoose.Schema({
    user: {
        type: String,
        ref: "User"
    },
    date:{
        type: Date,
        default: Date.now
    },
    exercise: {
        type: String, 
        required: true 
    },
    weight: {
        type: String,
        required: false
    },
    reps: {
        type: String, 
        required: false,
    },
    duration: {
        type: String,
        required: false,
    },
    intensity: {
        type: String, 
        required: false,
    },
    location: {
        type: String,
        required: false,
    }

    

})

module.exports = mongoose.model("JournalEntry", JournalEntrySchema); 