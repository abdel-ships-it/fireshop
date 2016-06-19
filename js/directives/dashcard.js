angular.module('directives.dashcard', []).directive('dashcard', function(){
	return {
		restrict: "E",
		scope: {
			products : "=",
			functions: "="
		},
		replace: false,
		templateUrl: "templates/dashcard.html",
		controller: ["$scope", 'myData', '$firebaseObject', function($scope, myData, $firebaseObject){

			/*The line under this comment will load the products from the database easier, but to understand directives better
			I am going to purposely use the $scope.functions as reference of how to call controller functions from within a
			Directive. Make sure you look at the scope of this directive up here, the view attribute (functions) on dashcard(HTML file) & the controller*/
			//$scope.products = $firebaseObject(myData.child("products"));
			

			$scope.functions.loadProducts().$loaded().then(function(data){
				console.log('data has loaded');
				$scope.products = data;
			})
			
			$scope.editProduct = function(id){
				// editCard(id);
				console.log($scope.products);
			}

			$scope.deleteProduct = function(id){
				console.log("click", id);
				var decision = confirm("You sure you want to delete this item");
				if(decision){
					myData.child("reviews/" + id).remove();
					myData.child("products/" + id).remove();
				}
				
			}


		}]
	};
});