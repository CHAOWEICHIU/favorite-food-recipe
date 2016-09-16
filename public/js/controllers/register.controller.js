angular.module('myApp').controller('RegisterCtrl', RegisterCtrl);

function RegisterCtrl($http){
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