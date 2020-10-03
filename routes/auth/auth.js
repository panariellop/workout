const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config()
const User = require("../../models/User");
const Token = require('../../models/Token'); 
const {authenticateToken} = require("../../middleware/authenticateToken");
const bcrypt = require('bcrypt') 

//@route    POST api/auth/users
//@dsc      Register/login a user
//@access   Public
router.post("/register", async (req, res)=> {
    var { username, email, password, status, admin_key } = req.body; 
    if(!username || !password || !email){
        return res.status(401).send("Please fill out register form completely.")
    }
		//Salt the password for security reasons 
		await bcrypt.hash(password, parseInt( process.env.BCRYPT_SALT_ROUNDS))
		.then((hashedPassword)=> {
			password = hashedPassword
		})
    const user = await User.findOne({username: username});
    if(user!==null){
        return res.status(500).send("User already exists");
    }
		const okemail = await User.findOne({email: email});
		if(okemail !== null){
			return res.status(500).send("Email belongs to a user");
		}

		if(status === "ADMIN" && (process.env.ADMIN_KEY !== admin_key)){
			return res.send(401).send("Incorrect admin key"); 
		}

    const newUser = new User({username, email, password, status});
		await newUser.save();
    
    //Sign jwt
    const accessToken = jwt.sign({username: username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }); 
    //Send refresh token to database 
    const refreshToken = jwt.sign({username: username}, process.env.REFRESH_TOKEN_SECRET); 
    const newToken = new Token({refreshToken: refreshToken, user: username});
    newToken.save(); 
    //Respond to the user with their accessToken and refresh token
    return res.status(200).json({accessToken: accessToken, refreshToken: refreshToken})

});

//@desc 	Login a user 
//@access 	Public
router.post('/login', async (req, res) => {       
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(401).send("Please fill out login form completely.")
    }

    //Authenticate user 
    const user = await User.findOne({ username: username });
    if (user===null){
        return res.status(401).send("User does not exist.")
    }
    
	//compare the salted password to the password entered 
	const okpassword = await bcrypt.compare(password, user.password)
	if(!okpassword){
		return res.status(401).send("Invalid password"); 
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

//@desc 	Give the user a new access token
//@access 	Private
router.post('/token', async (req, res)=> {
    const requestToken = req.body.token; 
    //Check if token was given, is in the database, and matches one created
    if(requestToken===null) return res.sendStatus(400);
		//Verify refresh token against database 
    const dataToken = await Token.findOne({refreshToken: requestToken});
    if(dataToken===null) return res.sendStatus(401); 
    if(dataToken.refreshToken!==requestToken) return res.sendStatus(401);
    //Verify the token 
    jwt.verify(requestToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=> {
        if(err) return res.sendStatus(401)
        const username = jwt.decode(requestToken).username
        const accessToken = jwt.sign({username: username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN });
        return res.status(200).json({ accessToken: accessToken }); 
    })

});

//@desc 	Logout a user
//@access 	Private 
router.delete('/logout', authenticateToken, async (req, res)=> {
    //Delete all refresh tokens attached to the current user 
    await Token.deleteMany({user: req.user.username}, (err, result)=> {
        if(err) return res.sendStatus(500)
        if(result) return res.status(200).json({msg:`User ${req.user.username} successfuly logged out`})
    })

});

module.exports = router;
