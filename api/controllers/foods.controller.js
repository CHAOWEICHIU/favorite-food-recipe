const mongoose = require('mongoose');
const Food = mongoose.model('Food');

// GET
module.exports.foodsGetAll = (req, res) => {
	Food
		.find()
		.exec((err, foods)=>{
			handleAfterExec(err, req, res, foods);
		})
}
module.exports.foodsGetOne = (req, res) => {
	var foodId = req.params.foodId;
	Food
		.findById(foodId)
		.exec((err, food)=>{
			handleAfterExec(err, req, res, food)
		})
}

// POST
module.exports.foodsAddOne = (req, res) => {
	Food
		.create({
			name: req.body.name,
			views: req.body.views,
			description: req.body.description,
			created_user: req.body.created_user
		}, (err, food)=>{
			handleAfterExec(err, req, res, food);
		})		
}
function handleAfterExec(err, req, res, doc){	
	if(err){
		res.status(500).send(err);
	} else if(!doc){
		res.status(404).send('not found')
	} else { 
		res.status(200).json({message: doc})
	};
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

				food.save((err, updatedFood)=>{
					handleAfterExec(err, req, res, updatedFood)
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
				handleAfterExec(err, req, res, `${foodId} not found`)	
			} else {
				handleAfterExec(err, req, res, 'successfully deleted')	
			}
		})

}

