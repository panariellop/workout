const express = require('express');
const connectDB = require("./config/db");
const bodyParser = require('body-parser')
const app = express(); 
connectDB(); 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/auth/users', require('./routes/auth/auth')); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`)); 