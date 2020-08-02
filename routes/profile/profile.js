const express = require('express')
const { Router } = require('express')
const router = express.Router()
const { authenticateToken } = require('../../middleware/authenticateToken'); 
const User = require('../../models/User'); 


//ROUTE /api/profile 
router.get('/', authenticateToken, async (req,res)=> {
    var user = await User.findOne({username: req.user.username})
    user.password = "*".repeat(user.password.length)
    return res.json(user)
})

router.post('/changepassword', authenticateToken, async (req, res)=> {
	const { new_password, old_password } = req.body
	var user = await User.findOne({username: req.user.username})
	if(old_password != user.password){
		return res.sendStatus(401)
	}
	const newUser = await  User.findOneAndUpdate({username: req.user.username}, {
		password: new_password
	})
	return res.json(newUser)
})
module.exports = router