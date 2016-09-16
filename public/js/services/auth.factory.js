angular.module('myApp').factory('AuthFactory',AuthFactory);

function AuthFactory(){
	return {
		auth: auth,
		loggedInUser: loggedInUser
	}

	var auth = {
		isLoggedIn: false
	}

	var loggedInUser = '';
}