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

// Define port to run
const port = process.env.PORT || 3000;

// Listen for request
server.listen(port);
console.log(`listening on port ${port}`)


var users = [];
io.sockets.on('connection', (socket)=>{
	
	// disconnect
	socket.on('disconnect', (data)=>{
		if(!socket.user) return
		
		if(users.indexOf(socket.user) != -1){
			users.splice(users.indexOf(socket.user), 1)	
		}
		
		console.log(`disconnected!!!!  remaind connected: ${users.length}`)
		updateUsers();
	})

	// socket.on('forceDisconnect', (user)=>{
 //    	socket.disconnect();
 //    	users.splice(users.indexOf(user), 1)
 //    	updateUsers();
	// });

	
	// listen to new msg
	socket.on('msg', (msg)=>{
		io.sockets.emit('get msg', msg)
	})

	// new user
	socket.on('user', (user)=>{
		socket.user = user;
		users.push(user)

		console.log(socket.user)
		console.log(`connected users: ${users.length}`)
		updateUsers()
	})
	



	// Reuseable function --------------------
	function updateUsers(){
		io.sockets.emit('get users', users)
	}
	// ----------------------------------------


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


