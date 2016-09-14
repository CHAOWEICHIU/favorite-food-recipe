const mongoose = require('mongoose');
const Food = mongoose.model('Food');

module.exports.foodsGetAll = (req, res) => {
	Food
		.find()
		.exec((err, foods)=>{
			if(err){
				res.status(500).send(err)
			} else {
				console.log('found foods', foods.length)
				res.status(200).json(foods)
			}
		})
}


var _splitHelper = (input)=>{
	var output
	if(input && input.length > 0){
		output = input.split(';')
	} else {
		output = []
	}
	return output
}


module.exports.foodsAddOne = (req, res) => {
	
	console.log(req.body)
	
	Food
		.create({
			name: req.body.name,
			views: req.body.views,
			reviews: _splitHelper(req.body.reviews),
			description: req.body.description,
			created_user: req.body.created_user
		}, (err, food)=>{
			if(err){
				console.log(err);
			} else {
				res.json(food);
			}
		})
		
}


module.exports.foodsGetOne = (req, res) => {
	var foodId = req.params.foodId;
	Food
		.findById(foodId)
		.exec((err, foods)=>{
			if(err){
				res.status(500).send(err)
			} else {
				console.log('found foods', foods.length)
				res.status(200).json(foods)
			}
		})
}



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

				food.save((err, updatedFood)=>{
					if(err){
						res.status(500).send(err)
					} else {
						res.status(204).send(updatedFood);
					}
				})
			}
		})
}

module.exports.foodsDeleteOne = (req, res) => {
	var foodId = req.params.foodId;
	Food
		.findByIdAndRemove(foodId)
		.exec((err, deletedFood)=>{
			if(err){
				res.status(404).send(err)
			} else {
				res.status(204).send('you have deleted food:' +foodId)
			}
		})

}

