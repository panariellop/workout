/*
READ
Url Request: (Object to return, return all associated with type, id of associated object)
** Object to return: (String)
	* This is the name of the object that the frontend wants returned 
** Return all associated with type: (Boolean)
	* If true, then it returns all the children of the parent object specified
** Id of associated object: (Number)
	* is the id of the object you want to return 


	- GET Read all the program templates from a user with a username
	- GET Read a specific program with an id -> return program object 
	- GET Read all the workout templates associated with a program template with an id 
	- GET Read a specific workout template with an id -> return workout template object 
	- GET Read all exercise templates with a parent workout template with id 
	- GET Read a specific exercise template with an id -> return exercise template object 
	- GET Read all set templates with a parent exercise with an id
	- GET Read a specific set template with an id -> return set template object 

CREATE
	- POST Create a new Program template
	- POST Create a new workout template with a parent program template 
	- POST Create a new exercise template with a parent workout template 
	- POST Create a new set template with a parent exercise template

UPDATE 
Url Request:(id)
	- PUT Update a new Program template with id 
	- PUT Update a new workout template with a parent program template with id 
	- PUT Update a new exercise template with a parent workout template with id 
	- PUT Update a new set template with a parent exercise template with id 

DELETE 
Url Request: (id)
	- DELETE a new Program template with id 
	- DELETE a new workout template with a parent program template with id 
	- DELETE a new exercise template with a parent workout template with id 
	- DELETE a new set template with a parent exercise template with id 
*/

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authenticateToken');
const { ProgramTemplate, WorkoutTemplate, ExerciseTemplate, SetTemplate }= require('../../models/ProgramTemplate')
//@DSC READ 
//PROTECTED = TRUE 
//TODO: add authenticateToken in middleware
router.get('/type/:type/all/:all/id/:id', async(req, res)=>{
	const {type, all, id} = req.params; 
	if(type == "programtemplate"){
		if(all == "true"){
			//id is the username of the user in this case
			await ProgramTemplate.find({user: id}, function(err, programs){
				return res.status(200).json({data: programs})
			})
		}else{
			await ProgramTemplate.findById(id, function(err, program){
				return res.status(200).json({data: program})
			})
		}
	}
	else if(type == "workouttemplate"){
		if(all == "true"){
			return res.status(200).json({msg: `Returning all workouts from program with id ${id}`})
		}
	}
	else if(type == "exercisetemplate"){

	}
	else if(type == "settemplate"){

	}
})

router.post('/type/:type/parent/:id1/:id2/:id3', authenticateToken, async(req, res)=>{
	const {type, id1, id2, id3} = req.params; 
	if(type == "programtemplate"){
		const {duration_days, workouts, input_params } = req.body; 
		newProgramTemplate = new ProgramTemplate({
			user: req.user.username, 
			duration_days: duration_days, 
			input_params: input_params
		})
		newProgramTemplate.save()
		return res.status(200).json(newProgramTemplate)
	}
	else if(type == "workouttemplate"){
		const {day_number, notes} = req.body; 
		await ProgramTemplate.findById(id1, (err, programTemplate)=>{
			if(err) return res.sendStatus(500); 
			newWorkoutTemplate = new WorkoutTemplate({
				day_number: day_number, 
				notes: notes
			})
			//creates a new object that is appended to the programs workouts array
			programTemplate.workouts.push(newWorkoutTemplate)
			programTemplate.save()
			return res.status(200).json(newWorkoutTemplate)	
		})
		
	}
	else if(type == "exercisetemplate"){
		const {name, notes} = req.body; 
		//need to recursively find the workout template because they are part of the program template object
		await ProgramTemplate.findById(id1, (err, programTemplate)=>{
			newExerciseTemplate = null; 
			if(err) return res.sendStatus(500); 
			for(var i = 0; i<programTemplate.workouts.length; i++){
				if(programTemplate.workouts[i].id == id2){
					newExerciseTemplate = new ExerciseTemplate({
						name: name, 
						notes: notes
					})
					programTemplate.workouts[i].exercises.push(newExerciseTemplate); 
				}
			}
			programTemplate.save()
			return res.status(200).json(newExerciseTemplate); 
		})
	}
	else if(type == "settemplate"){
		const {weight, reps, duration, distance, intensity, notes} = req.body; 
		await ExerciseTemplate.findById(id, (err, exerciseTemplate)=>{
			if(err) return res.status(500); 
			newSetTemplate = new SetTemplate({
				weight: weight, 
				reps: reps, 
				duration: duration, 
				distance: distance, 
				intensity: intensity, 
				notes: notes, 
			})	
			exerciseTemplate.sets.push(newSetTemplate); 
			exerciseTemplate.save()
			return res.status(200).json(newSetTemplate)
		})
	}
})

router.put('/type/:type/id/:id', authenticateToken, (req, res)=>{
	const {type, id} = req.body; 

})

module.exports = router; 


