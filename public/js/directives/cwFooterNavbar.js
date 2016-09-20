angular.module('myApp')
	.directive('cwFooterNavbar', cwFooterNavbar)

function cwFooterNavbar(){
	return {
		restrict: 'E',
		templateUrl: 'templates/cwFooterNavbar.html',
		controller: function($scope){
			
		},
		link: function(scope, iElement, iAttrs){
			
		}
	}
}
