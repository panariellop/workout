const express = require('express')
const { Router } = require('express')
const router = express.Router()
const { authenticateToken } = require('../../middleware/authenticateToken'); 
const User = require('../../models/User'); 
const Token = require('../../models/Token')
const JournalEntry = require('../../models/JournalEntry'); 
const bcrypt = require('bcrypt');
require('dotenv').config();

//DESC Get's a user's profile information 
//ROUTE /api/profile 
//METHOD GET 
//BODY NONE
router.get('/', authenticateToken, async (req,res)=> {
    var user = await User.findOne({username: req.user.username})
    //do not send over password -- send over some random asteriks 
    user.password = "*".repeat(3)
    return res.json(user)
})

//DESC Changes a user's password 
//ROUTE /api/profile/changepassword
//METHOD POST 
//BODY { old_password, new_password }
router.post('/changepassword', authenticateToken, async (req, res)=> {
	var { new_password, old_password } = req.body
	var user = await User.findOne({username: req.user.username})
	
	//Confirm password using bcrypt
	const okpassword = bcrypt.compare(old_password, user.password)
	if(!okpassword){
		return res.sendStatus(401)
	}
	
	//Salt the password for security reasons 
	await bcrypt.hash(new_password, parseInt( process.env.BCRYPT_SALT_ROUNDS))
	.then((hashedPassword)=> {
		new_password = hashedPassword
	})

	//Update user object in database  
	const newUser = await  User.findOneAndUpdate({username: req.user.username}, {
		password: new_password
	})
	return res.json({msg: "User's password was successfully updated."})
})

//DESC Deletes a user's account 
//ROUTE /api/profile
//METHOD DELTE 
//BODY { password }
router.delete('/', authenticateToken, async (req, res)=> {
	//need a user's password in the request's body to confirm deletion 
	const { password } = req.body;
	var user = await User.findOne({username: req.user.username})
	if(password != user.password){
		return res.sendStatus(401) //send not authorized if password is wrong
	} 
	//Remove the user 
	await User.findOneAndDelete({username: req.user.username})
	.then(res => {
		if (res === undefined || res === null){
			return res.status(500).json({msg: "Error deleting user from database."})
		}
	})
	//Remove the user's refresh tokens
	await Token.deleteMany({user: req.user.username}, (err, result)=> {
		if (err) return res.status(500).json({msg: "Error deleting user's tokens from database."})
	})
	//Remove the user's workouts from the database 
	await JournalEntry.deleteMany({user: req.user.username}, (err, result)=> {
		if(err) return res.status(500).json({msg: "Error deleting user's journal entries from database."})
	})
	return res.json({msg: `User ${req.user.username}'s account is successfully deleted.`})
})

/*
A user can save links to their profile for later viewing
supports CRUD format
*/

//@DESC: view all links 
router.get('/program_links', authenticateToken, async(req,res)=> {
	let user  = await User.findOne({username: req.user.username});
	let cur_links = user.program_links
	if(!cur_links){
		return res.json({msg: `User ${res.user.username} did not have any links`})
	}
	return res.json({cur_links})
})

//@DESC: Create a link 
router.post('/program_links', authenticateToken, async(req, res) => {
	const { name, link } = req.body;
	//Save the link to the user's profile
	let user = User.findOne({username: req.user.username});
	let cur_links = user.program_links
	//Error handling 
	if(!cur_links){
		cur_links = {}
	}
	cur_links[name] = link;  
	await User.findOneAndUpdate({username: req.user.username}, {program_links: cur_links}, (err, result)=> {
		if(err) return res.status(500).json({msg: "Error adding a link"})
		return res.json({msg: `New link successfully added to user ${req.user.username}'s account`})
	});

})
//@DESC: Delete a link 
router.delete('/program_links', authenticateToken, async(req, res) => {
	const { name } = req.body;
	//Save the link to the user's profile
	let user = User.findOne({username: req.user.username});
	let cur_links = user.program_links
	//Error handling 
	if(!cur_links){
		return res.json({msg: `User ${req.user.username} does not have any program links`})
	}
	delete cur_links[name]  
	await User.findOneAndUpdate({username: req.user.username}, {program_links: cur_links}, (err, result)=> {
		if(err) return res.status(500).json({msg: "Error removing a link"})
		return res.json({msg: `Link successfully removed`})
	});

})
//@DESC: Update a link 
router.put('/program_links', authenticateToken, async(req, res) => {
	const { name, link } = req.body;
	//Save the link to the user's profile
	let user = User.findOne({username: req.user.username});
	let cur_links = user.program_links
	//Error handling 
	if(!cur_links){
		return res.json({msg: `User ${req.user.username} does not have any program links`})
	}
	cur_links[name] = link;   
	await User.findOneAndUpdate({username: req.user.username}, {program_links: cur_links}, (err, result)=> {
		if(err) return res.status(500).json({msg: "Error updating a link"})
		return res.json({msg: `Link successfully updated`})
	});

})
module.exports = router
