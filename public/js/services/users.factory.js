angular.module('myApp').factory('UsersDataFactory', UsersDataFactory);

function UsersDataFactory($http){
	return {
		postUserLikes: postUserLikes,
		updateUserLikes: updateUserLikes,
		getUser: getUser,
		updateUser: updateUser,
		getAllUsers: getAllUsers
		
	}

	function postUserLikes(userId, foodId, boolean){
		return $http.post(`/api/users/${userId}/likes`,{foodId:foodId, like:boolean}).then(compeleted).catch(failed)
	}

	function updateUserLikes(userId, updatedLike){
		return $http.put(`/api/users/${userId}/likes`, updatedLike).then(compeleted).catch(failed)
	}

	function getUser(userId){
		return $http.get(`/api/users/${userId}`).then(compeleted).catch(failed)
	}
	function updateUser(userId, updatedUser){
		return $http.put(`/api/users/${userId}`, updatedUser)
	}
	function getAllUsers(){
		return $http.get('/api/users').then(compeleted).catch(failed)
	}

	
	



	function compeleted(response){
		return response.data;
	}

	function failed(error){
		console.log(error.statusText)
	}
}