angular.module('myApp').factory('foodsDataFactory', foodsDataFactory);

function foodsDataFactory($http){
	return {
		foodsGetAll: foodsGetAll,
		foodsGetOne: foodsGetOne,
		foodAddOneToViews: foodAddOneToViews
	}

	function foodsGetAll(){
		return $http.get('/api/foods').then(compeleted).catch(failed)
	}

	function foodAddOneToViews(foodId, updatedFood){
		$http.put('/api/foods/'+foodId, updatedFood);
	}

	function foodsGetOne(id){
		return $http.get('/api/foods/'+id).then(compeleted).catch(failed)
	}

	function compeleted(response){
		return response.data;
	}

	function failed(error){
		console.log(error.statusText)
	}
}