'use strict'

const mongoose = require('mongoose');
const User = mongoose.model('User');


function handleResStatus(err, req, res, doc){	
	if(err){
		console.log('err')
		res.status(500).json({message: err})
	} else if(!doc){
		console.log('!doc')
		res.status(404).json({message: 'Not Found'})
	} 

	if(doc !== 'undefined'){
		res.status(200).json({message: doc})
	}
}


module.exports.likesGetAll = (req, res) => {
	var userId = req.params.userId;
	User
		.findById(userId)
		.select('likes')
		.exec((err, food)=>{
			if(err){
				handleResStatus(err, req, res)
			} else {
				handleResStatus(err, req, res, food.steps, 200)
			}
		})
}

module.exports.likesAddOne = (req, res) => {
	var userId = req.params.userId;

	User.findById(userId)
		.select('likes')
		.exec((err, user)=>{
			if(user){
				_addLike(req, res, user)
			} else {
				handleResStatus(err, req, res)
			}
		})
}

module.exports.likeUpdateOne = (req, res)=>{
	let userId = req.params.userId;
	let foodId = req.body.foodId;
  	User
		.findById(userId)
		.select('likes')
		.exec(function(err, user) {
			// find index
			let indexOfLike = user.likes.map(function(e) { return e.foodId; }).indexOf(foodId);
			
			// change boolean of like
			user.likes[indexOfLike].like = req.body.like
			
			// save change
			user.save((err,updatedUser)=>{
				handleResStatus(err, req, res, updatedUser.likes[indexOfLike])
			})
			
			
			
		});
}


var _addLike = (req, res, user)=>{
	console.log(req.body)
	user.likes.push({
		foodId: req.body.foodId,
		like: req.body.like
	})

	user.save((err,updateduser)=>{
		handleResStatus(err, req, res, updateduser.likes[updateduser.likes.length - 1])
	})
}