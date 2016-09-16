angular.module('myApp')
	.controller('FoodsCtrl', FoodsCtrl)
	.controller('FoodCtrl', FoodCtrl)

function FoodsCtrl($scope, $location, foodsDataFactory){
	var vm = this;
	

	$scope.$watch('searchInfo', (newV, oldV)=>{
		vm.searchInfo = newV
	})

	// Get all foods from API
	foodsDataFactory.foodsGetAll().then((response)=>{
		vm.foods = response.message;
	})
	vm.title = 'giiii'
	console.log('foods')
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

function FoodCtrl($routeParams, foodsDataFactory, $http, $route){
	var vm = this 
	var id = $routeParams.id

	// Get the food from API
	foodsDataFactory.foodsGetOne(id).then((response)=>{
		vm.food = response.message;
	})


	vm.addReview = function(){
		var reviewData = {
			username: vm.username,
			stars: vm.stars,
			review: vm.review,
		}
		console.log(reviewData)
		$http.post(`/api/foods/${id}/reviews`, reviewData).then(()=>{
			foodsDataFactory.foodsGetOne(id).then((response)=>{
				vm.food = response.message;
			})
		}).then(()=>{
			$("#reviews").append('<li></li>')
		})
		
		

		
	}
	
}