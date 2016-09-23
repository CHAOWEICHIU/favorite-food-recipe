'use strict'
require('./api/models/db.js')
const express = require('express'),
	  ejs = require('ejs'),
	  mongoose = require('mongoose'),
	  routes = require('./api/routes'),
 	  path = require('path'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  server = require('http').createServer(app),
	  io = require('socket.io').listen(server),
	  messagesController = require('./api/controllers/messages.controller');

console.log(messagesController)
// Define port to run
const port = process.env.PORT || 3000;

// Listen for request
server.listen(port);
console.log(`listening on port ${port}`)


io.sockets.on('connection', (socket)=>{
	socket.on('send msg', (data)=>{
		messagesController.addMessage(data.user, data.msg)
		io.sockets.emit('get msg', data)
	})
})


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


