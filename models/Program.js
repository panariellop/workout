const mongoose = require('mongoose')

const ProgramSet = mongoose.Schema({
	weight: {
		value: {type: Number, required: false},
		units: {type: String},
      	percentage_of_input: {type: Number, required: false}, 
      	//ex: 95 not 0.95
      	input_param: {type: String, required: false}, 
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

const ProgramExercise = mongoose.Schema({
	sets: [SetTemplate], 
	name: {
		type: String, required: true
	},
	notes: {
		type: String, required: false
	}
})

const ProgramWorkout = mongoose.Schema({
	day_number: {
		type: Number, required: true
	},
	exercises: [ExerciseTemplate]
})


const Program = mongoose.Schema({
	user: {
		type: String, 
		ref: "User"
	}, 
	duration_days: {
		type: Number, 
		required: true, 
	}, 
	workouts: [WorkoutTemplate], 
	input_params: [String]
	//let the user define some input parameters that will determine how the program gets synthesized from the program template

})


module.exports = mongoose.model("ProgramTemplate", ProgramTemplateSchema);
