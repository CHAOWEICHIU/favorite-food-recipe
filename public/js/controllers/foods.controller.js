angular.module('myApp')
	.controller('FoodsCtrl', FoodsCtrl)
	.controller('FoodCtrl', FoodCtrl)
	.controller('FoodsAddCtrl', FoodsAddCtrl)

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

function FoodCtrl($routeParams, foodsDataFactory, $http, $route, AuthFactory){
	var vm = this;
	var id = $routeParams.id;

	vm.isLoggedIn = () => {
		if(AuthFactory.isLoggedIn){
			return true
		} else {
			return false
		}
	};

	function countAverageStars(vm, food){
		let totalFoods = food.reviews.length
		let sum = food.reviews.reduce((sum, review)=> sum + review.stars, 0)
		vm.averageStars = sum / totalFoods;
	};
	vm.averageStars;
	// Get the food from API
	foodsDataFactory.foodsGetOne(id).then((response)=>{
		let food = response.message;
		vm.food = food;
		countAverageStars(vm, food);
		
	})

	vm.hasSummited = false;

	vm.addReview = function(){
		console.log(AuthFactory.loggedInUser)
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
}

function FoodsAddCtrl(){
	
}