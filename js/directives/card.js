angular.module('directives.card', []).directive('card', function(){
	return {
		restrict: "E",
		scope: {
			products : "=",
			reviews: "="
		},
		replace: false,
		templateUrl: "templates/card.html",
		controller: function($scope){
			console.log($scope.products)
		}
	};
});