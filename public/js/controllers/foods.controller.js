angular.module('myApp')
	.controller('FoodsCtrl', FoodsCtrl)
	.controller('FoodCtrl', FoodCtrl)
	.controller('FoodsAddCtrl', FoodsAddCtrl)
	.controller('FoodsEditCtrl', FoodsEditCtrl)

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
		countAverageStars(vm, response.message);
		
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
		$http.put(`http://localhost:3000/api/foods/${id}`, vm.food).then((res)=>{
			if(res.status === 200){
				vm.isUpdated = true;	
			}
		})
	}

	vm.deleteInstruction = (stepId)=>{
		$http.delete(`http://localhost:3000/api/foods/${id}/steps/${stepId}`).then((res)=>{
			updateFood()
		})
	}

	vm.deleteIngredient = (ingredientId)=>{
		$http.delete(`http://localhost:3000/api/foods/${id}/ingredients/${ingredientId}`).then((res)=>{
			updateFood()
		})
	}

	vm.addInstruction = ()=>{
		var step = {
			stepNumber: vm.stepNumber,
			stepName: vm.stepName
		}
		console.log(step)
		$http.post(`http://localhost:3000/api/foods/${id}/steps`,step).then((res)=>{
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
		$http.post(`http://localhost:3000/api/foods/${id}/ingredients`,ingredient).then((res)=>{
			if(res.status === 201){
				updateFood()
				vm.gram = ''
				vm.name
			} else {
				console.log(res)
			}
		})
	}
}
