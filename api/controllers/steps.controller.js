'use strict'

const mongoose = require('mongoose');
const Food = mongoose.model('Food');

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


module.exports.stepsGetAll = (req, res) => {
	var foodId = req.params.foodId;
	Food
		.findById(foodId)
		.select('steps')
		.exec((err, food)=>{
			if(err){
				handleResStatus(err, req, res)
			} else {
				handleResStatus(err, req, res, food.steps, 200)
			}
		})
}


var _addStep = (req, res, food)=>{
	food.steps.push({
		stepNumber: req.body.stepNumber,
		stepName: req.body.stepName
	})
	food.save((err,updatedFood)=>{
		if(err){
			handleResStatus(err, req, res)	
		} else {
			handleResStatus(err, req, res, updatedFood.steps[updatedFood.steps.length - 1], 201)	
		}
		
	})
}

module.exports.stepsAddOne = (req, res) => {
	console.log('start to add')
	var foodId = req.params.foodId;
	Food.findById(foodId)
		.select('steps')
		.exec((err, food)=>{
			if(food){
				_addStep(req, res, food)
			} else {
				handleResStatus(err, req, res)
			}
		})
}

module.exports.stepsGetOne = (req, res) => {
	var foodId = req.params.foodId;
	var stepId = req.params.stepId;
	Food
		.findById(foodId)
		.select('steps')
		.exec((err, food)=>{
			console.log(err)
			if(err){
				handleResStatus(err, req, res)
			} else {
				handleResStatus(err, req, res, food.steps.id(stepId), 200)
			}
		})
}

module.exports.stepsUpdateOne = (req, res)=>{
	var foodId = req.params.foodId;
	var stepId = req.params.stepId;
  	Food
		.findById(foodId)
		.select('steps')
		.exec(function(err, food) {
		  var thisStep;
		  if (err) {
		    handleResStatus(err, req, res)
		  } else if(!food) {
		    handleResStatus(err, req ,res)
		  } else {
		    thisStep = food.steps.id(stepId);
		    if (!thisStep) {
		    	handleResStatus(err, req, res)
		    } else {
				thisStep.stepName = req.body.stepName;
			    thisStep.stepNumber = req.body.stepNumber;
			    food.save((err, updatedFood)=>{
			    	handleResStatus(err, req, res, thisStep, 200)
			    })
		    }
		  }
		});
}

module.exports.stepsDeleteOne = (req, res)=>{
	var foodId = req.params.foodId;
	var stepId = req.params.stepId;
	var thisStep;
	Food
		.findById(foodId)
		.select('steps')
		.exec((err, food)=>{
	
			if(err){
				handleResStatus(err, req, res)
			}  else {
				thisStep = food.steps.id(stepId)
				if(!thisStep){
					handleResStatus(err, req, res)
				} else {
					food.steps.id(stepId).remove();
					food.save((err, updatedFood)=>{
						handleResStatus(err, req, res, updatedFood, 200)
					})	
				}
			}
		})
}


