angular.module('myApp').factory('foodsDataFactory', foodsDataFactory);

function foodsDataFactory($http){
	return {
		foodsGetAll: foodsGetAll,
		foodsGetOne: foodsGetOne,
		foodsAddOne: foodsAddOne,
		foodUpdate: foodUpdate,
		foodAddOneReview: foodAddOneReview,
		foodAddStep: foodAddStep,
		foodAddIngredient: foodAddIngredient,
		foodDeleteStep: foodDeleteStep,
		foodDeleteIngredient: foodDeleteIngredient
	}

	function foodsGetAll(){
		return $http.get('/api/foods').then(compeleted).catch(failed)
	}
	function foodsGetOne(id){
		return $http.get('/api/foods/'+id).then(compeleted).catch(failed)
	}
	function foodsAddOne(food){
		return $http.post('/api/foods',food).then(compeleted).catch(failed)
	}

	function foodUpdate(foodId, updatedFood){
		return $http.put(`/api/foods/${foodId}`, updatedFood).then(compeleted).catch(failed)
	}
	function foodAddOneReview(id, reviewData){
		return $http.post(`/api/foods/${id}/reviews`, reviewData).then(compeleted).catch(failed)
	}
	function foodAddStep(id, step){
		return $http.post(`/api/foods/${id}/steps`,step).then(compeleted).catch(failed)
	}
	function foodAddIngredient(id, ingredient){
		return $http.post(`/api/foods/${id}/ingredients`,ingredient).then(compeleted).catch(failed)
	}
	function foodDeleteStep(id, stepId){
		return $http.delete(`/api/foods/${id}/steps/${stepId}`).then(compeleted).catch(failed)
	}
	function foodDeleteIngredient(id, ingredientId){
		return $http.delete(`/api/foods/${id}/ingredients/${ingredientId}`).then(compeleted).catch(failed)
	}

	



	function compeleted(response){
		return response.data;
	}

	function failed(error){
		console.log(error.statusText)
	}
}