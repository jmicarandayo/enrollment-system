const cookie = require('cookie-parser');
const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const hostname = 'localhost';
const port = process.env.port || 5000;
const mysql = require('mysql2');
const app = express();
dotenv.config({path: './.env'});


// To Parse the incoming request with JSON payloads
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Define Routes
app.use('/', require('./routes/enrollmentRoutes'));
app.use('/auth', require('./routes/auth'));

// Cookie-Parser
app.use(cookie());

// 
const publicDir = path.join(__dirname, './public/');
app.use(express.static(publicDir));

// Setting the handle bars view engine template
app.set('view engine', 'hbs');

// Server Listening
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

