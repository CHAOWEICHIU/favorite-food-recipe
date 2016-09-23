'use strict'

const mongoose = require('mongoose');


var messageSchema = new mongoose.Schema({
	created_user:{
		type: String
	}, 
	msg:{
		type: String
	}, 
	created_at: {
		type: Date,
		default: Date.now()
	},
	private_to_user:{
		type: String
	}
});

mongoose.model('Message', messageSchema, 'messages')