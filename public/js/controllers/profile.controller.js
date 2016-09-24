angular.module('myApp').controller('ProfileCtrl', ProfileCtrl);


function ProfileCtrl($location, $window, AuthFactory, UsersDataFactory, $http){
	var vm = this;
	var socket = io.connect();
	var updatedUser = {};
	vm.isUpdated = false;
	vm.linkTo = (url) => {
		$location.path(url)
	}
	vm.logout = () => {
		// remove token from session
		delete $window.sessionStorage.token;
		
		// remove user and login status to false
		AuthFactory.isLoggedIn = false;
		AuthFactory.loggedInUser = '';
		AuthFactory.loggedInUserId = '';
		AuthFactory.chatRoomStarted = false;
		$location.path('/');
		$window.location.reload();
	}
	UsersDataFactory.getUser(AuthFactory.loggedInUserId).then((res)=>{
		let user = res.message
		vm.name = user.name
		vm.username = user.username
		vm.profileUrl = user.profileUrl
		updatedUser.password = user.password
		updatedUser.likes = user.likes
	})

	vm.updateUser = ()=>{
		vm.isUpdated = false;
		updatedUser.name = vm.name;
		updatedUser.username = vm.username;
		updatedUser.profileUrl = vm.profileUrl;
		UsersDataFactory.updateUser(AuthFactory.loggedInUserId, updatedUser).then((res)=>{
			vm.isUpdated = true;
		})
	}
	

	
	




}