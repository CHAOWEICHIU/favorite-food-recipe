angular.module('myApp', ['ngRoute']).config(config);

function config($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'views/welcome.html'
		})
		.when('/foods', {
			templateUrl: 'views/foods/index.html',
			controller: 'FoodsCtrl',
			controllerAs: 'vm'
		})
		.when('/foods/:id', {
			templateUrl: 'views/foods/show.html',
			controller: 'FoodCtrl',
			controllerAs: 'vm'
		})
		.when('/register', {
			templateUrl: 'views/register/register.html',
			controller: 'RegisterCtrl',
			controllerAs: 'vm'	
		})
}