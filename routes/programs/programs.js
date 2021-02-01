const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authenticateToken');

/*
POST Create programs from templates 
GET 
	- GET Program 
	- GET ProgramWorkout
	- GET ProgramExercise 
	- GET ProgramSet
PUT 
	- PUT Program 
	- PUT ProgramWorkout
	- PUT ProgramExercise 
	- PUT ProgramSet
DELETE
	- DELETE ProgramWorkout
	- DELETE ProgramExercise 
	- DELETE ProgramSet

*/
