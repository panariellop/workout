const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

//@route    POST api/auth/users
//@dsc      Register a user
//@access   Public
router.post("/register", (req,res)=> {
    return res.status(200).json({"msg": req.body}); 
});

router.post('/login', async (req, res) => {
    return res.status(200).json({"msg": req.body}); 
}); 

module.exports = router;
