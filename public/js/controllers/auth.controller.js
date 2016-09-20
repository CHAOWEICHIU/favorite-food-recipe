angular.module('myApp')
	.controller('SignupCtrl', SignupCtrl)
	.controller('LoginCtrl', LoginCtrl);


function userLogin($http, $window, $location,AuthFactory, jwtHelper ,user, vm){
	$http.post('/api/users/login' ,user).then((response)=>{
		if(response.data.message.success){
			// GET token from back-end
			var token = response.data.message.token
			
			// Get user by decoding token
			var decodedToken = jwtHelper.decodeToken(token);
			
			// Add user and login status to true in factory
			AuthFactory.isLoggedIn = true;
			AuthFactory.loggedInUser = decodedToken.name;

			// Add token to session
			$window.sessionStorage.token = token;			
			$location.path('/');
		} 
	}, (failed)=>{
		vm.error = 'Invalid password or user name';
		vm.username = '';
		vm.password = ''
		$location.path('/login');
	})
}


function SignupCtrl($http, $window ,$location, AuthFactory, jwtHelper){
	var vm = this;

	vm.registerUser = () => {
		var user = {
			username: vm.username,
			name: vm.name,
			password: vm.password
		}

		$http.post('/api/users/register', user).then((response)=>{
			
			// login
			userLogin($http, $window, $location,AuthFactory ,jwtHelper ,user)
			
		}).catch((error)=>{
			console.log(error)
		})
	}
}

function LoginCtrl($q ,$window, AuthFactory, $http, $location, jwtHelper){
	var vm = this;
	
	vm.isLoggedIn = () => {
		if(AuthFactory.isLoggedIn){
			return true
		} else {
			return false
		}
	}

	vm.login = () => {
		if(vm.username && vm.password){
			var user = {
				username: vm.username,
				password: vm.password
			}
			
			// login
			userLogin($http, $window, $location, AuthFactory, jwtHelper, user, vm)
			
		}
	}

	vm.logout = () => {
		// remove token from session
		delete $window.sessionStorage.token;
		
		// remove user and login status to false
		AuthFactory.isLoggedIn = false;
		AuthFactory.loggedInUser = '';

		$location.path('/')
	}

	vm.isActiveTab = (url) => {
		var currentPath = $location.path()
		return (url === currentPath ? 'active' : '' )
	}

}




