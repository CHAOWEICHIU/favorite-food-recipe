const mongoose = require('mongoose');
const Food = mongoose.model('Food');

module.exports.reviewsGetAll = (req, res)=>{
	var foodId = req.params.foodId;
	Food
		.findById(foodId)
		.select('reviews')
		.exec((err, food)=>{
			if(err){
				res.status(404).send(err)
			} else {
				res.status(200).json(food.reviews)
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
				res.status(404).send(err)
			} else {
				var review = food.reviews.id(reviewId)
				res.status(200).json(review)
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
		if(err){
			res.status(300).send(err)
		} else {
			res.status(201)
				.json(updatedFood.reviews[updatedFood.reviews.length - 1])
		}
	})
}

module.exports.reviewsAddOne = (req, res)=>{
	var foodId = req.params.foodId;
	Food.findById(foodId)
		.select('reviews')
		.exec((err, food)=>{
			if(err){
				console.log('Error finding food')
				res.status(500).send('Error finding food')
			} else if (!food){
				res.status(500).send('Food not found')
			} 

			if(food){
				console.log('_addReview')
				_addReview(req, res, food)
			} else {
				res
					.status(response.status)
					.json(response)	
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
				res.status(500).send(err);
			} else if (!food){
				res.status(404).send('Food not found')
			} else {
				thisReview = food.reviews.id(reviewId)
				if(!thisReview){
					res.status(404).send('Review not found')
				} else {
					food.reviews.id(reviewId).remove()
					food.save((err, updatedFood)=>{
						if(err){ 
							res.status(500).send(err)
						} else {
							console.log('removed review successfully')
							res.status(204).json()
						}
					})
				}
			}
		})
}

module.exports.reviewsUpdateOne = (req, res)=>{
	var foodId = req.params.foodId;
	var reviewId = req.params.reviewId;
  	

  	Food
		.findById(foodId)
		.select('reviews')
		.exec(function(err, food) {
		  var thisReview;
		  var response = {
		    status : 200,
		    message : {}
		  };
		  if (err) {
		    console.log("Error finding food");
		    response.status = 500;
		    response.message = err;
		  } else if(!food) {
		    console.log("Food id not found in database", id);
		    response.status = 404;
		    response.message = {
		      "message" : "Food ID not found " + id
		    };
		  } else {
		    // Get the review
		    thisReview = food.reviews.id(reviewId);
		    // If the review doesn't exist Mongoose returns null
		    if (!thisReview) {
		      response.status = 404;
		      response.message = {
		        "message" : "Review ID not found " + reviewId
		      };
		    }
		  }
		  if (response.status !== 200) {
		    res
		      .status(response.status)
		      .json(response.message);
		  } else {
		    thisReview.username = req.body.username;
		    thisReview.stars = parseInt(req.body.stars, 10);
		    thisReview.review = req.body.review;
		    food.save(function(err) {
		      if (err) {
		        res
		          .status(500)
		          .json(err);
		      } else {
		        console.log('here')
		        res
		          .status(204)
		          .send('updated successfully')
		      }
		    });
		  }
		});
}