'use strict'
require('./api/models/db.js')
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const routes = require('./api/routes');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');


// Define port to run
const port = process.env.PORT || 3000;


// Add middleware to console.log every request
// app.use((req,res,next)=>{
// 	console.log(`${req.method} ${req.url}`);
// 	next();
// })



// Set static directory before defining routes
app.use(express.static(path.join(__dirname, 'public')))
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')))


// Enable parsing of posted forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Set static directory before defining routes
app.use('/assets', express.static(__dirname + '/public'))



// Add routing
app.use('/api', routes);


// Listen for request
app.listen(port);
console.log(`listening on port ${port}`)