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


module.exports = router