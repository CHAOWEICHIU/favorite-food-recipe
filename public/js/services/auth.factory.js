angular.module('myApp').factory('AuthFactory',AuthFactory);

function AuthFactory(){
	return {
		auth: auth,
		loggedInUser: loggedInUser,
		loggedInUserId: loggedInUserId
	}

	var auth = {
		isLoggedIn: false
	}

	var loggedInUser = '';
	var loggedInUserId = '';
}