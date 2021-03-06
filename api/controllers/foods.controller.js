'use strict'

const mongoose = require('mongoose');
const Food = mongoose.model('Food');
const User = mongoose.model('User');
const Q = require('q');

// re-useable function
function handleResStatus(err, req, res, doc){	
	if(err){
		res.status(500).send(err);
	} else if(!doc){
		res.status(404).send('not found')
	} 

	if(doc !== 'undefined'){
		res.status(200).json({message: doc})
	}
}

// GET
module.exports.foodsGetAll = (req, res) => {
	function getAllUsers(){ return User.find({})}
	function getAllFoods(){ return Food.find({})}
	
	var groupPromise = Q.all([ getAllUsers(), getAllFoods()])
	groupPromise.then((data)=>{
		let users = data[0];
		let foods = data[1];
		// count user's total like to each food
		let mdFoods = foods.map((food)=>{
			let countLikes = 0
			users.forEach((user)=>{
				if(user.likes.length != 0){
					user.likes.forEach((like)=>{
						if(like.foodId == food._id && like.like == true){
							countLikes +=1
						}
					})
				}
			})
			food.likes = countLikes;
			return food;
		})
		return mdFoods;
	}).then((foods)=>{
		handleResStatus('', req, res, foods);
	})

}
module.exports.foodsGetOne = (req, res) => {
	var foodId = req.params.foodId;
	Food
		.findById(foodId)
		.exec((err, food)=>{
			console.log(err)
			handleResStatus(err, req, res, food)
		})
}

// POST
module.exports.foodsAddOne = (req, res) => {
	Food
		.create({
			name: req.body.name,
			views: req.body.views,
			description: req.body.description,
			link: req.body.link,
			created_user: req.body.created_user
		}, (err, food)=>{
			handleResStatus(err, req, res, food);
		})		
}

// UPDATE
module.exports.foodsUpdateOne = (req, res) => {
	var foodId = req.params.foodId;
	Food
		.findById(foodId)
		// .select('-rooms')
		.exec((err, food)=>{
			
			if(err){
				res.status(500).send('Error find the food!')
			} else if (!food){
				res.status(404).send('food not found')
			} else {
				food.name = req.body.name,
				food.views = req.body.views,
				food.description = req.body.description,
				food.created_user = req.body.created_user
				food.link = req.body.link

				food.save((err, updatedFood)=>{
					handleResStatus(err, req, res, updatedFood)
				})
			}
		})
}

// DELETE
module.exports.foodsDeleteOne = (req, res) => {
	var foodId = req.params.foodId;
	Food
		.findById(foodId)
		.remove()
		.exec((err, deleted)=>{
			if(deleted.result.n == 0){
				handleResStatus(err, req, res, `${foodId} not found`)	
			} else {
				handleResStatus(err, req, res, 'successfully deleted')	
			}
		})

}

