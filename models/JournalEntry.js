const mongoose = require('mongoose');

const EntrySet = mongoose.Schema({
    weight: {
        value: {type: Number},
        units: {type: String},
        required: false
    },
    //User can specify percentages of input parameters for each set 
    reps: {
        type: Number,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    },
    distance: {
        value: {type: Number}, 
        units: {type: String},
        required: false, 
    },
    intensity: {
        type: String,
        required: false,
    },
    notes: {
        type: String, required: false
    }
    
})

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

    sets: [EntrySet],

    location: {
        type: String,
        required: false,
    }



})



module.exports = mongoose.model("JournalEntry", JournalEntrySchema);
