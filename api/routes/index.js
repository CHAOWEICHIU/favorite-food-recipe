'use strict'

const express = require('express');
const router = express.Router();
const foodsController = require('../controllers/foods.controller');
const reviewsController = require('../controllers/reviews.controller');
const usersController = require('../controllers/users.controller');
const ingredientsController = require('../controllers/ingredients.controller');
// Food Route
router
	.route('/foods')
	.get(foodsController.foodsGetAll) 
	.post(foodsController.foodsAddOne)

router
	.route('/foods/:foodId')
	.get(foodsController.foodsGetOne)
	.put(foodsController.foodsUpdateOne)
	.delete(foodsController.foodsDeleteOne)


// Food's reviews route
router
	.route('/foods/:foodId/reviews')
	.get(reviewsController.reviewsGetAll) 
	.post(reviewsController.reviewsAddOne)

router
	.route('/foods/:foodId/reviews/:reviewId')
	.get(reviewsController.reviewsGetOne)
	.put(reviewsController.reviewsUpdateOne)
	.delete(reviewsController.reviewsDeleteOne)

// Food's ingredient route
router
	.route('/foods/:foodId/ingredients')
	.get(ingredientsController.ingredientsGetAll) 
	.post(ingredientsController.ingredientsAddOne);

router
	.route('/foods/:foodId/ingredients/:ingredientId')
	.get(ingredientsController.ingredientsGetOne)
	.put(ingredientsController.ingredientsUpdateOne)
	.delete(ingredientsController.ingredientsDeleteOne)

// Auth
router
	.route('/users/register')
	.post(usersController.register)

router
	.route('/users/login')
	.post(usersController.login)


module.exports = router;