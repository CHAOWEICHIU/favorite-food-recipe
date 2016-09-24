'use strict'

const mongoose = require('mongoose');

var likeSchema = new mongoose.Schema({
	foodId:{
		type: String
	},
	like: {
		type: Boolean
	}
},{ _id : false })

var userSchema = new mongoose.Schema({
	username:{
		type: String,
		required: true,
		unique: true
	}, 
	name:{
		type: String
	}, 
	profileUrl:{
		type: String
	},
	password:{
		type:String,
		required:true
	},
	likes: [likeSchema]
});

mongoose.model('User', userSchema, 'users')