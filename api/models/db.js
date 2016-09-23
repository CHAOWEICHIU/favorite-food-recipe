'use strict'

var mongoose = require('mongoose');
// Local 
var dbUrl = 'mongodb://localhost/fav-food-recipe'
// mongolab
var dbUrl = 'mongodb://cw:cw@ds029456.mlab.com:29456/fav-food-recipe'




mongoose.connect(dbUrl);
var connection =  mongoose.connection

connection.on('connected',()=>{
	console.log('Connected to ' + dbUrl)
})

connection.on('disconnected',()=>{
	console.log('Mongoose Disconnected ')
})

connection.on('error',(err)=>{
	console.log('Mongoose connection error: '+err)
})

process.on('SIGINT', ()=>{
	mongoose.connection.close(()=>{
		console.log('DB disconnected via termination (SIGIN)')
		process.exit(0)
	})
})

// For heroku termination
process.on('SIGTERM', ()=>{
	mongoose.connection.close(()=>{
		console.log('DB disconnected via termination (SIGTERM)')
		process.exit(0)
	})
})

process.once('SIGUSR2', ()=>{
	mongoose.connection.close(()=>{
		console.log('DB disconnected via termination (SIGUSR2)')
		process.kill(process.pid, 'SIGUSR2')
	})
})


// Bring in model
require('./users.model.js')
require('./foods.model.js')