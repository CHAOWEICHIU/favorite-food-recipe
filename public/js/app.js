angular.module('myApp', ['ngRoute', 'angular-jwt'])
	.config(config)
	.run(run)


function config($provide, $routeProvider, $httpProvider){
	$provide.value('chatStarted', false)
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
		.when('/chat', {
			templateUrl: 'views/chat/chat.html',
			controller: 'ChatCtrl',
			controllerAs: 'vm',
			access: {
				restricted: true
			}
		})
		.when('/collection', {
			templateUrl: 'views/foods/collection.html',
			controller: 'CollectionCtrl',
			controllerAs: 'vm',
			access: {
				restricted: true
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
		.when('/foods/:id/edit', {
			templateUrl: 'views/foods/edit.html',
			controller: 'FoodsEditCtrl',
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
		.when('/profile', {
			templateUrl: 'views/auth/profile.html',
			controller: 'ProfileCtrl',
			controllerAs: 'vm',
			access: {
				restricted: true
			}
		})
}

function run($rootScope, $location, $window, AuthFactory, jwtHelper){
	if($window.sessionStorage.token){
		var token = $window.sessionStorage.token;
		var decodedToken = jwtHelper.decodeToken(token);
					
		// Add user and login status to true in factory
		AuthFactory.loggedInUser = decodedToken.name;
		AuthFactory.loggedInUserId = decodedToken.id;
		AuthFactory.chatRoomStarted = false;
	}
	$rootScope.$on('$routeChangeStart', (event, nextRoute, previousRoute)=>{
		if(nextRoute.access !=='undefined' && nextRoute.access.restricted && !$window.sessionStorage.token && !AuthFactory.isLoggedIn && !AuthFactory.loggedInUserId){
			event.preventDefault();
			$location.path('/')
		}
	})
}