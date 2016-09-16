angular.module('myApp', ['ngRoute']).config(config);

function config($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'views/foods/index.html',
			controller: 'FoodsCtrl',
			controllerAs: 'vm'
		})
		.when('/foods/add', {
			templateUrl: 'views/foods/add.html',
			controller: 'FoodsAddCtrl',
			controllerAs: 'vm'
		})
		.when('/foods/:id', {
			templateUrl: 'views/foods/show.html',
			controller: 'FoodCtrl',
			controllerAs: 'vm'
		})
		.when('/signup', {
			templateUrl: 'views/auth/signup.html',
			controller: 'SignupCtrl',
			controllerAs: 'vm'	
		})
		.when('/login', {
			templateUrl: 'views/auth/login.html',
			controller: 'LoginCtrl',
			controllerAs: 'vm'	
		})
}