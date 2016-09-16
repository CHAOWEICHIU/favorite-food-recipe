'use strict'

const mongoose = require('mongoose');
const Food = mongoose.model('Food');


/*
DELETE[ ]  /api/foods/:id/ingredients/:id

Delete a specific ingredient
*/


function handleResStatus(err ,req, res, doc ,stauts){	
	if(err){
		res.status(500).send(err);
	} else if (!doc){
		console.log('!doc')
		res.status(404).send('not found')
	} else {
		switch(stauts){
			case 200:
				res.status(200).json({message:doc});
				break;
			case 201:
				console.log('created')
				res.status(201).json({message:doc});
				break;
			default:
				console.log('unknow!', err, doc)
				res.status(500).send(err);
		}
	}
}

module.exports.ingredientsGetAll = (req, res)=>{
	var foodId = req.params.foodId;
	Food
		.findById(foodId)
		.select('ingredients')
		.exec((err, food)=>{
			if(err){
				handleResStatus(err, req, res)
			} else {
				handleResStatus(err, req, res, food.ingredients, 200)
			}
		})
}

module.exports.ingredientsGetOne = (req, res)=>{
	var foodId = req.params.foodId;
	var ingredientId = req.params.ingredientId;
	Food
		.findById(foodId)
		.select('ingredients')
		.exec((err, food)=>{
			console.log(err)
			if(err){
				handleResStatus(err, req, res)
			} else {
				handleResStatus(err, req, res, food.ingredients.id(ingredientId), 200)
			}
		})
}

var _addIngredient = (req, res, food)=>{
	food.ingredients.push({
		name: req.body.name,
		gram: req.body.gram
	})
	food.save((err,updatedFood)=>{
		if(err){
			handleResStatus(err, req, res)	
		} else {
			handleResStatus(err, req, res, updatedFood.ingredients[updatedFood.ingredients.length - 1], 201)	
		}
		
	})
}

module.exports.ingredientsAddOne = (req, res)=>{
	var foodId = req.params.foodId;
	Food.findById(foodId)
		.select('ingredients')
		.exec((err, food)=>{
			if(food){
				_addIngredient(req, res, food)
			} else {
				handleResStatus(err, req, res)
			}
		})
}

module.exports.ingredientsDeleteOne = (req, res) => {
	var foodId = req.params.foodId;
	var ingredientId = req.params.ingredientId;
	var thisIngredient;
	Food
		.findById(foodId)
		.select('ingredients')
		.exec((err, food)=>{
	
			if(err){
				handleResStatus(err, req, res)
			}  else {
				thisIngredient = food.ingredients.id(ingredientId)
				if(!thisIngredient){
					handleResStatus(err, req, res)
				} else {
					food.ingredients.id(ingredientId).remove();
					food.save((err, updatedFood)=>{
						handleResStatus(err, req, res, updatedFood, 200)
					})	
				}
			}
		})
}

module.exports.ingredientsUpdateOne = (req, res)=>{
	var foodId = req.params.foodId;
	var ingredientId = req.params.ingredientId;
  	Food
		.findById(foodId)
		.select('ingredients')
		.exec(function(err, food) {
		  var thisIngredient;
		  if (err) {
		    handleResStatus(err, req, res)
		  } else if(!food) {
		    handleResStatus(err, req ,res)
		  } else {
		    thisIngredient = food.ingredients.id(ingredientId);
		    if (!thisIngredient) {
		    	handleResStatus(err, req, res)
		    } else {
				thisIngredient.name = req.body.name;
			    thisIngredient.gram = req.body.gram;
			    food.save((err, updatedFood)=>{
			    	handleResStatus(err, req, res, thisIngredient, 200)
			    })
		    }
		  }
		});
}