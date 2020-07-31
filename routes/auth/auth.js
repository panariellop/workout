const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()
const User = require("../../models/User");
const Token = require('../../models/Token'); 
const {authenticateToken} = require("../../middleware/authenticateToken");

//@route    POST api/auth/users
//@dsc      Register/login a user
//@access   Public
router.post("/register", async (req, res)=> {
    const { username, email, password, status } = req.body; 
    if(!username || !password || !email){
        return res.status(401).send("Please fill out register form completely.")
    }
    const user = await User.findOne({username: username});
    if(user!==null){
        return res.status(500).send("User already exists");
    }

    const newUser = new User({username, email, password, status});
    newUser.save();
    
    //Sign jwt
    const accessToken = jwt.sign({username: username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }); 
    //Send refresh token to database 
    const refreshToken = jwt.sign({username: username}, process.env.REFRESH_TOKEN_SECRET); 
    const newToken = new Token({refreshToken: refreshToken, user: username});
    newToken.save(); 
    //Respond to the user with their accessToken and refresh token
    return res.status(200).json({accessToken: accessToken, refreshToken: refreshToken})

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
    const accessToken = jwt.sign({username: username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }); 
    //Send refresh token to database 
    const refreshToken = jwt.sign({username: username}, process.env.REFRESH_TOKEN_SECRET); 
    const newToken = new Token({refreshToken: refreshToken, user: username});
    newToken.save(); 
    //Respond to the user with their accessToken and refresh token
    return res.status(200).json({accessToken: accessToken, refreshToken: refreshToken})

}); 

//Get new accessToken
router.post('/token', async (req, res)=> {
    const requestToken = req.body.token; 
    //Check if token was given, is in the database, and matches one created
    if(requestToken===null) return res.sendStatus(400);
    const dataToken = await Token.findOne({refreshToken: requestToken});
    if(dataToken===null) return res.sendStatus(401); 
    if(dataToken.refreshToken!==requestToken) return res.sendStatus(401);
    jwt.verify(requestToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=> {
        if(err) return res.sendStatus(401)
        const accessToken = jwt.sign({username: user.name}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
        return res.status(200).json({ accessToken: accessToken }); 
    })

});

//Logout
router.delete('/logout', authenticateToken, async (req, res)=> {
    //Delete all refresh tokens attached to the current user 
    await Token.deleteMany({user: req.user.username}, (err, result)=> {
        if(err) return res.sendStatus(500)
        if(result) return res.status(200).json({msg:`User ${req.user.username} successfuly logged out`})
    })

});

module.exports = router;
