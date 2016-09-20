angular.module('myApp')
	.directive('cwHeaderNavbar', cwHeaderNavbar)

function cwHeaderNavbar(){
	return {
		restrict: 'E',
		require: 'cwHeaderNavbar',
		templateUrl: 'templates/cwHeaderNavbar.html',
		controller: function($scope){
			$scope.searchInfo = ''
		},
		link: function(scope, iElement, iAttrs){
			
		}
	}
}
