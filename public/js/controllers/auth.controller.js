angular.module('myApp')
	.controller('SignupCtrl', SignupCtrl)
	.controller('LoginCtrl', LoginCtrl);

function SignupCtrl($http){
	var vm = this;

	vm.registerUser = () => {
		var user = {
			username: vm.username,
			name: vm.name,
			password: vm.password
		}
		console.log(user)

		$http.post('http://localhost:3000/api/users/register', user).then((response)=>{
			console.log(response)
			vm.message = 'Successfully created user';
			vm.error = '';
		}).catch((error)=>{
			vm.message = '';
			vm.error = error.data.message;
		})
	}
}

function LoginCtrl($window, AuthFactory, $http, $location, jwtHelper){
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
			$http.post('api/users/login' ,user).then((response)=>{
				if(response.data.message.success){
					// Token from back-end
					var token = response.data.message.token
					
					// Get user by decoding token
					var decodedToken = jwtHelper.decodeToken(token);
					
					// Add user and login status to true in factory
					AuthFactory.loggedInUser = decodedToken.name;
					AuthFactory.isLoggedIn = true;

					// Add token to session
					$window.sessionStorage.token = token
					

					vm.username = '';
					vm.password = '';
					$location.path('/')
				}

				
			}).catch((error)=>{
				console.log(error)
			})
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




