angular.module('myApp')
	.controller('FoodsCtrl', FoodsCtrl)
	.controller('FoodCtrl', FoodCtrl)
	.controller('FoodsAddCtrl', FoodsAddCtrl)
	.controller('FoodsEditCtrl', FoodsEditCtrl)
	.controller('CollectionCtrl', CollectionCtrl)


function CollectionCtrl($q ,AuthFactory, UsersDataFactory, foodsDataFactory, $location){
	let vm = this,
		userId = AuthFactory.loggedInUserId;

	vm.search = ''
	
	// get User likes
	$q.all([
		UsersDataFactory.getUser(userId),
		foodsDataFactory.foodsGetAll()
	]).then((res)=>{
		
		vm.likedFood = res[0].message.likes.reduce((container, like)=> {
			
			// get what food the user like	
			if(like.like == true){
				container.push(like.foodId)
				return container 
			}
			return container
		}, []).reduce((container, likeId)=>{
			
			// associate user's food collection with real data
			let foods = res[1].message;
			let indexOfFood = foods.map((e)=>e._id).indexOf(likeId)
			container.push(foods[indexOfFood])
			return container
		}, [])
	})
	
	vm.linkTo = (foodId)=>{
		$location.path('/foods/'+foodId)

	}

}


// Foods List Controller
function FoodsCtrl($scope, $location, foodsDataFactory){
	var vm = this;

	$scope.$watch('searchInfo', (newV, oldV)=>{
		vm.searchInfo = newV
	})

	// Get all foods from API
	foodsDataFactory.foodsGetAll().then((response)=>{
		vm.foods = response.message;
	})
	vm.linkTo = function(foodId){
		// link to the food
		$location.path('/foods/'+foodId)
		
		// add one view to food's views
		var foundFood = $.grep(vm.foods, (e)=>{ return e._id == foodId; });
		var updatedFood = foundFood[0];
		updatedFood.views = updatedFood.views + 1;
		foodsDataFactory.foodUpdate(foodId, updatedFood)
	}
}




// Food Show Controller
function FoodCtrl($scope,$routeParams, foodsDataFactory, $route, AuthFactory, UsersDataFactory){
	var vm = this,
		id = $routeParams.id,
		likes,
	    likeIndex;

	vm.loggedInUser = AuthFactory.loggedInUser
	vm.hasSummited = false;


	// check if log in or not
	vm.isLoggedIn = () => {
		if(AuthFactory.isLoggedIn){
			return true
		} else {
			return false
		}
	};

	// Get the food from API
	foodsDataFactory.foodsGetOne(id).then((response)=>{
		let food = response.message;
		vm.food = food;
		countAverageStars(vm, response.message);
	})


	// if loggged in
	if(vm.loggedInUser && AuthFactory.isLoggedIn, AuthFactory.loggedInUserId){
		// init like starting point
		UsersDataFactory.getUser(AuthFactory.loggedInUserId).then((res)=>{
			
			likes = res.message.likes;
			likeIndex = likes.map(function(e) { return e.foodId; }).indexOf(id);
			if(likeIndex === -1){
				handleLikeStatus(likeIndex, false, id)
			} else {
				vm.like = likes[likeIndex].like;
			}
		})

		
	}
	
	



	// like switcher
	vm.switchLike = (boolean)=>{
		UsersDataFactory.getUser(AuthFactory.loggedInUserId).then((res)=>{
			likes = res.message.likes;
			likeIndex = likes.map(function(e) { return e.foodId; }).indexOf(id);
			handleLikeStatus(likeIndex, boolean, id)
		})	
	}

	// Add review function
	vm.addReview = function(){
		var reviewData = {
			username: AuthFactory.loggedInUser,
			stars: vm.stars,
			review: vm.review,
		}
		
		// add one review to database
		foodsDataFactory.foodAddOneReview(id, reviewData).then((res)=>{
			
			// get that review from database
			foodsDataFactory.foodsGetOne(id).then((res)=>{
				let food = res.message
				vm.food = food;
				vm.stars = '';
				vm.review = '';
				vm.hasSummited = true;
				countAverageStars(vm, food)
			})
		
		// add the review to view
		}).then(()=>{
			$("#reviews").append('<li></li>')
		})

	}	

	function handleLikeStatus(likeIndex, boolean, id){
		// check if food like's data in User's DB
		if(likeIndex === -1){
			
			// if no, add one
			UsersDataFactory.postUserLikes(AuthFactory.loggedInUserId, id, boolean).then((res)=>{
				vm.like = boolean;
			})
			
		} else {
			
			// if yes, update it accordingly
			let updatedLike = {foodId: id, like:boolean};
			UsersDataFactory.updateUserLikes(AuthFactory.loggedInUserId, updatedLike).then((res)=>{
				vm.like = boolean;
			})
			
		}
	}


	// for generating number of stars
	vm.range = function(n) {
        return new Array(n);
    };
	
	function countAverageStars(vm, food){
		if(food.reviews.length === 0){
			vm.averageStars = 0;
		} else {
			let totalFoods = food.reviews.length;
			let sum = food.reviews.reduce((sum, review)=> sum + review.stars, 0)
			vm.averageStars = Math.round(sum / totalFoods);
		}
	};
}



// Add foods controller
function FoodsAddCtrl(AuthFactory, $location, foodsDataFactory){
	var vm = this;

	vm.addFood = ()=>{
		var food = {
			name: vm.name,
			description: vm.description,
			link: vm.link,
			created_user: AuthFactory.loggedInUser
		}
		foodsDataFactory.foodsAddOne(food).then((res)=>{
			console.log('add one food')
			let id = res.message._id
			$location.path(`/foods/${id}/edit`);
		})
	}

}






// Edit Food Controller
function FoodsEditCtrl($scope ,$routeParams, foodsDataFactory){
	var vm = this;
	var id = $routeParams.id;
	vm.isUpdated = false;
	
	function updateFood(){
		foodsDataFactory.foodsGetOne(id).then((response)=>{
			let food = response.message;
			vm.food = food;
		})
	}
	updateFood();
	
	vm.updateInfo = ()=>{
		foodsDataFactory.foodUpdate(id, vm.food).then((res)=>{
			if(res.message){
				vm.isUpdated = true;	
			}
		})
	}

	vm.deleteInstruction = (stepId)=>{
		foodsDataFactory.foodDeleteStep(id, stepId).then(()=>{
			updateFood();
		})
	}

	vm.deleteIngredient = (ingredientId)=>{
		foodsDataFactory.foodDeleteIngredient(id, ingredientId).then(()=>{
			updateFood();
		})
	}

	vm.addInstruction = ()=>{
		var step = {
			stepNumber: vm.stepNumber,
			stepName: vm.stepName
		}
		foodsDataFactory.foodAddStep(id, step).then((res)=>{
			if(res.message){
				updateFood()
				vm.stepNumber +=1;
				vm.stepName = '';
			}
		})
	}

	vm.addIngredient = ()=>{
		var ingredient = {
			gram: vm.gram,
			name: vm.name
		}
		foodsDataFactory.foodAddIngredient(id, ingredient).then((res)=>{
			if(res.message){
				updateFood()
				vm.gram = '';
				vm.name = '';
			}
		})
	}
}
