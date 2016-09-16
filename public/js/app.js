angular.module('myApp', ['ngRoute', 'angular-jwt'])
	.config(config)
	.run(run);

function config($routeProvider, $httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor')
	$routeProvider
		.when('/', {
			templateUrl: 'views/foods/index.html',
			controller: 'FoodsCtrl',
			controllerAs: 'vm',
			access: {
				restricted: false
			}
		})
		.when('/foods/add', {
			templateUrl: 'views/foods/add.html',
			controller: 'FoodsAddCtrl',
			controllerAs: 'vm',
			access: {
				restricted: true
			}
		})
		.when('/foods/:id', {
			templateUrl: 'views/foods/show.html',
			controller: 'FoodCtrl',
			controllerAs: 'vm',
			access: {
				restricted: false
			}
		})
		.when('/signup', {
			templateUrl: 'views/auth/signup.html',
			controller: 'SignupCtrl',
			controllerAs: 'vm',
			access: {
				restricted: false
			}
		})
		.when('/login', {
			templateUrl: 'views/auth/login.html',
			controller: 'LoginCtrl',
			controllerAs: 'vm',
			access: {
				restricted: false
			}
		})
}

function run($rootScope, $location, $window, AuthFactory, jwtHelper){
	if($window.sessionStorage.token){
		var token = $window.sessionStorage.token;
		var decodedToken = jwtHelper.decodeToken(token);
					
		// Add user and login status to true in factory
		AuthFactory.loggedInUser = decodedToken.name;
	}
	$rootScope.$on('$routeChangeStart', (event, nextRoute, previousRoute)=>{
		if(nextRoute.access !=='undefined' && nextRoute.access.restricted && !$window.sessionStorage.token && !AuthFactory.isLoggedIn){
			event.preventDefault();
			$location.path('/')
		}
	})
}