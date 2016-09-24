angular.module('myApp').factory('AuthFactory',AuthFactory);

function AuthFactory(){
	return {
		auth: auth,
		loggedInUser: loggedInUser,
		loggedInUserId: loggedInUserId,
		chatRoomStarted: chatRoomStarted 
	}

	 

	var auth = {
		isLoggedIn: false
	}

	var chatRoomStarted = '';
	var loggedInUser = '';
	var loggedInUserId = '';
}