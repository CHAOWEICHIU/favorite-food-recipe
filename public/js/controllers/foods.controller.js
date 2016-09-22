angular.module('myApp')
	.controller('FoodsCtrl', FoodsCtrl)
	.controller('FoodCtrl', FoodCtrl)
	.controller('FoodsAddCtrl', FoodsAddCtrl)
	.controller('FoodsEditCtrl', FoodsEditCtrl)



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
		
		// +1 to the food views 
		var foundFood = $.grep(vm.foods, (e)=>{ return e._id == foodId; });
		var updatedFood = foundFood[0];
		updatedFood.views = updatedFood.views + 1;
		foodsDataFactory.foodAddOneToViews(foodId, updatedFood)
	}
}




// Food Show Controller
function FoodCtrl($scope,$routeParams, foodsDataFactory, $http, $route, AuthFactory){
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

	// init starting data point
	$http.get(`/api/users/${AuthFactory.loggedInUserId}`).then((res)=>{
		likes = res.data.message.likes;
		likeIndex = likes.map(function(e) { return e.foodId; }).indexOf(id);
		if(likeIndex === -1){
			handleLikeStatus(likeIndex, false, id)
		} else {
			vm.like = likes[likeIndex].like;
		}
	})

	// Get the food from API
	foodsDataFactory.foodsGetOne(id).then((response)=>{
		let food = response.message;
		vm.food = food;
		countAverageStars(vm, response.message);
	})



	// like switcher
	vm.switchLike = (boolean)=>{
		$http.get(`/api/users/${AuthFactory.loggedInUserId}`).then((res)=>{
			likes = res.data.message.likes;
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
		$http.post(`/api/foods/${id}/reviews`, reviewData).then(()=>{
			foodsDataFactory.foodsGetOne(id).then((response)=>{
				let food = response.message
				vm.food = food;
				vm.stars = '';
				vm.review = '';
				vm.hasSummited = true;
				countAverageStars(vm, food)
			})
		}).then(()=>{
			$("#reviews").append('<li></li>')
		})
	}	

	function handleLikeStatus(likeIndex, boolean, id){
		// check if food like's data in User's DB
		if(likeIndex === -1){
			
			// if no, add one
			$http.post(`/api/users/${AuthFactory.loggedInUserId}/likes`,{foodId:id, like:boolean}).then((res)=>{
				vm.like = boolean;
			})
			
		} else {
			
			// if yes, update it accordingly
			let updatedLike = {foodId: id, like:boolean};
			$http.put(`/api/users/${AuthFactory.loggedInUserId}/likes`, updatedLike).then((res)=>{
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
function FoodsAddCtrl(AuthFactory, $http, $location){
	var vm = this;

	vm.addFood = ()=>{
		var food = {
			name: vm.name,
			description: vm.description,
			link: vm.link,
			created_user: AuthFactory.loggedInUser
		}
		$http.post('/api/foods',food).then((response)=>{
			let id = response.data.message._id
			$location.path(`/foods/${id}/edit`);
		})
	}

}






// Edit Food Controller
function FoodsEditCtrl($scope ,$routeParams, foodsDataFactory, $http){
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
		$http.put(`/api/foods/${id}`, vm.food).then((res)=>{
			if(res.status === 200){
				vm.isUpdated = true;	
			}
		})
	}

	vm.deleteInstruction = (stepId)=>{
		$http.delete(`/api/foods/${id}/steps/${stepId}`).then((res)=>{
			updateFood()
		})
	}

	vm.deleteIngredient = (ingredientId)=>{
		$http.delete(`/api/foods/${id}/ingredients/${ingredientId}`).then((res)=>{
			updateFood()
		})
	}

	vm.addInstruction = ()=>{
		var step = {
			stepNumber: vm.stepNumber,
			stepName: vm.stepName
		}
		$http.post(`/api/foods/${id}/steps`,step).then((res)=>{
			if(res.status === 201){
				updateFood()
				vm.stepNumber +=1;
				vm.stepName = '';
			} else {
				console.log(res)
			}
		})
	}

	vm.addIngredient = ()=>{
		var ingredient = {
			gram: vm.gram,
			name: vm.name
		}
		$http.post(`/api/foods/${id}/ingredients`,ingredient).then((res)=>{
			if(res.status === 201){
				updateFood()
				vm.gram = '';
				vm.name = '';
			} else {
				console.log(res)
			}
		})
	}
}
