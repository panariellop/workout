const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 20; 
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
require('dotenv').config()
const authenticateToken = require('../../middleware/authenticateToken'); 
const User = require("../../models/User");

//@route    POST api/auth/users
//@dsc      Register/login a user
//@access   Public
router.post("/register", async (req, res)=> {
    const { username, email, password, status } = req.body; 
    if(!username || !password || !email){
        return res.status(401).send("Please fill out login form completely.")
    }
    const user = await User.findOne({username: username});
    if(user!==null){
        return res.status(500).send("User already exists");
    }

    const newUser = new User({username, email, password, status});
    newUser.save();

    //Check if user was saved 
    const savedUser = await User.findOne({username: username});
    if(!savedUser) return res.sendStatus(500); 
    
    //Sign jwt
    const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET); 
    return res.status(200).json({accessToken: accessToken})

});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(401).send("Please fill out login form completely.")
    }

    //Authenticate user 
    const user = await User.findOne({ username: username });
    if (user===null || user.password !== password){
        return res.status(401).send("Invalid credentials.")
    }

    //Sign jwt
    const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET); 
    return res.status(200).json({accessToken: accessToken})

}); 

module.exports = router;
