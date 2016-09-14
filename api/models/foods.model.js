const mongoose = require('mongoose');

var reviewsSchema = new mongoose.Schema({
	username: {
		type: String,
		require: true
	},
	stars: {
		type: Number,
		min:0,
		max:5,
		require: true
	},
	review: {
		type:String,
		require:true
	},
	created_at: {
		type: Date,
		"default": Date.now()
	}
})

var ingredientSchema = new mongoose.Schema({
	name:{
		type: String
		// require: true
	},
	gram:{
		type: Number
		// require: true
	}
})

var foodSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true
	},
	views: Number,
	description: String,
	reviews: [String],
	reviews: [reviewsSchema],
	ingredients: [ingredientSchema],
	directions: [String],
	created_user: {
		type: String,
		require: true
	},
	created_at: {
		type: Date,
		"default": Date.now()
	}

});

mongoose.model('Food',foodSchema,'foods');

