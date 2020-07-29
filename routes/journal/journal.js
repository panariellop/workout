const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/authenticateToken'); 
const JournalEntry = require('../../models/JournalEntry'); 
const User = require('../../models/User'); 
//ROUTE /api/journal
//DESC All CRUD functionality for user's journal logs 
//ACCESS protected by auth 

//DESC get all of a user's exercises
router.get("/", authenticateToken, async (req, res)=> {
    //get user's _id 
    const user = await User.findOne({username: req.user.username}); 
    if(user === null) return res.sendStatus(401)
    const entries = await JournalEntry.find({user: user._id}, null ,{sort: {date: -1}}); 

    return res.status(200).json(entries); 

    
})

router.post("/", authenticateToken, async(req,res)=> {
    
})

module.exports = router;