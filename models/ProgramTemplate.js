const mongoose = require('mongoose')

const SetTemplate = mongoose.Schema({
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
        value: {type: Number},
        units: {type: String}, 
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

const ExerciseTemplate = mongoose.Schema({
	sets: [SetTemplate], 
	name: {
		type: String, required: true
	},
	notes: {
		type: String, required: false
	}
})

const WorkoutTemplate = mongoose.Schema({
	day_number: {
		type: Number, required: true
	},
	exercises: [ExerciseTemplate],
	notes: {type: String, required: false}
})


const ProgramTemplate = mongoose.Schema({
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


module.exports = {
	ProgramTemplate: mongoose.model("ProgramTemplate", ProgramTemplate),
	WorkoutTemplate: mongoose.model("WorkoutTemplate", WorkoutTemplate),
	ExerciseTemplate: mongoose.model("ExerciseTemplate", ExerciseTemplate),
	SetTemplate: mongoose.model("SetTemplate", SetTemplate),

}
