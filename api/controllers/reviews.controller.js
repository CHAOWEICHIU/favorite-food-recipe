const mongoose = require('mongoose');
const Food = mongoose.model('Food');


function handleResStatus(err, req, res, doc){	
	if(err){
		console.log('err')
		res.status(500).send(err);
	} else if(!doc){
		console.log('!doc')
		res.status(404).send('not found')
	} 

	if(doc !== 'undefined'){
		res.status(200).json({message: doc})
	}
}


module.exports.reviewsGetAll = (req, res)=>{
	var foodId = req.params.foodId;
	Food
		.findById(foodId)
		.select('reviews')
		.exec((err, food)=>{
			if(err){
				handleResStatus(err, req, res)
			} else {
				handleResStatus(err, req, res, food.reviews)
			}
			
		})
}

module.exports.reviewsGetOne = (req, res)=>{
	var foodId = req.params.foodId;
	var reviewId = req.params.reviewId;
	Food
		.findById(foodId)
		.select('reviews')
		.exec((err, food)=>{
			if(err){
				handleResStatus(err, req, res)
			} else {
				handleResStatus(err, req, res, food.reviews.id(reviewId))
			}
		})
}

var _addReview = (req, res, food)=>{
	food.reviews.push({
		username: req.body.username,
		stars: parseInt(req.body.stars, 10),
		review: req.body.review
	})

	food.save((err,updatedFood)=>{
		handleResStatus(err, req, res, updatedFood.reviews[updatedFood.reviews.length - 1])
	})
}

module.exports.reviewsAddOne = (req, res)=>{
	var foodId = req.params.foodId;
	console.log(foodId)
	Food.findById(foodId)
		.select('reviews')
		.exec((err, food)=>{
			if(food){
				_addReview(req, res, food)
			} else {
				handleResStatus(err, req, res)
			}
		})
}

module.exports.reviewsDeleteOne = (req, res) => {
	var foodId = req.params.foodId;
	var reviewId = req.params.reviewId;
	console.log('start to delete review')
	var thisReview;
	Food
		.findById(foodId)
		.select('reviews')
		.exec((err, food)=>{
			if(err){
				console.log('first err')
				handleResStatus(err, req, res)
			}  else {
				thisReview = food.reviews.id(reviewId)
				if(!thisReview){
					handleResStatus(err, req, res)
				} else {
					food.reviews.id(reviewId).remove();
					food.save((err, updatedFood)=>{
						handleResStatus(err, req, res, updatedFood)
					})	
				}
			}
		})
}

module.exports.reviewsUpdateOne = (req, res)=>{
	console.log('start to update review')
	var foodId = req.params.foodId;
	var reviewId = req.params.reviewId;
  	Food
		.findById(foodId)
		.select('reviews')
		.exec(function(err, food) {
		  var thisReview;
		  
		  if (err) {
		    handleResStatus(err, req, res)
		  } else if(!food) {
		    handleResStatus(err, req ,res)
		  } else {
		    thisReview = food.reviews.id(reviewId);
		    if (!thisReview) {
		    	handleResStatus(err, req, res)
		    } else {
				thisReview.username = req.body.username;
			    thisReview.stars = parseInt(req.body.stars, 10);
			    thisReview.review = req.body.review;
			    food.save((err, updatedFood)=>{
			    	handleResStatus(err, req, res, updatedFood)
			    })
		    }
		  }
		});
}