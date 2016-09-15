angular.module('myApp')
	.controller('FoodsCtrl', FoodsCtrl)
	.controller('FoodCtrl', FoodCtrl)

function FoodsCtrl($location, foodsDataFactory){
	var vm = this;
	
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

function FoodCtrl($routeParams, foodsDataFactory){
	var vm = this 
	var id = $routeParams.id

	// Get the food from API
	foodsDataFactory.foodsGetOne(id).then((response)=>{
		vm.food = response.message;
	})
	
}