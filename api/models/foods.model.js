'use strict'

const mongoose = require('mongoose');

var stepsSchema = new mongoose.Schema({
	stepNumber:{
		type: Number,
		required: true
	},
	stepName: {
		type: String,
		required: true
	}

})

var reviewsSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	stars: {
		type: Number,
		min:0,
		max:5,
		required: true
	},
	review: {
		type: String,
		required:true
	},
	created_at: {
		type: Date,
		"default": Date.now()
	}
})

var ingredientSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	gram:{
		type: Number,
		required: true
	}
})

var foodSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	views: {
		type: Number,
		"default": 0
	},
	link:{
		type: String,
		require: true
	},
	description: {
		type: String,
		required: true
	},
	reviews: [reviewsSchema],
	ingredients: [ingredientSchema],
	steps: [stepsSchema],
	created_user: {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		"default": Date.now()
	},
	likes: {
		type: Number,
		"default": 0
	}

});

mongoose.model('Food',foodSchema,'foods');

