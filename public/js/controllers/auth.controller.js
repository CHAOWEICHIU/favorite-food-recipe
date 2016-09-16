angular.module('myApp')
	.controller('SignupCtrl', SignupCtrl)
	.controller('LoginCtrl', LoginCtrl);

function SignupCtrl($http){
	console.log('signup ctrl')
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

function LoginCtrl($window, AuthFactory, $http, $location){
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
					$window.sessionStorage.token = response.data.message.token;
					AuthFactory.isLoggedIn = true;
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
		delete $window.sessionStorage.token;
		AuthFactory.isLoggedIn = false;
	}

	vm.isActiveTab = (url) => {
		
		var currentPath = $location.path()
		return (url === currentPath ? 'active' : '' )
	}

}




