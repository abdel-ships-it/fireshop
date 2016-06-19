var checkout = angular.module('checkOut', ["firebase"]);


checkout.directive('onLastRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
            }, 1);
        };
    }).controller('displayTable', ["$scope", function($scope){
    $scope.$on('onRepeatLast', function(scope, element, attrs){
        $("#loadingBar").slideUp(400);
        $("#myTable").show();
    });
    
    chosenItems = JSON.parse(localStorage.getItem("Cart"));
    var productsDB = new Firebase('https://radiant-torch-3756.firebaseio.com/products');
    $scope.products = [];
    updateTable();
    
    $scope.getTotal = function(){
        var total = 0;
        for(var i = 0; i < $scope.products.length; i++){
            var product = $scope.products[i];
            total += (product.price * product.quantity);
        }
        return total;
    }

   function updateTable(){
        if(chosenItems == null || chosenItems.length == 0){
            $("#myTable").hide();
            $("#OuterCircle").fadeIn('slow');
            $("#wrapper").css('overflow-y','hidden');
            $("#Card").css('height', '50em');
        }else{
            for (var i=0, f=0; i < chosenItems.length; i++) {
                productsDB.child(chosenItems[i]).once("value", function(snapshot) {
                    $scope.products.push(snapshot.val());
                    $scope.$apply();
                    console.log($scope.products);
                    }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
            } 
        }
        $("#loadingBar").slideUp(400);
    }

    $("#myTable").on( "click", "#removeItem", function() {
         $scope.products = [];
         $(this).parents().eq(2).fadeOut();
         var deletedItemId = $(this).parents().eq(2).attr('id');
         chosenItems.splice((chosenItems.indexOf('' + deletedItemId + '')),1);
         localStorage.setItem("Cart", JSON.stringify(chosenItems));
         updateTable();
    });

  /*  window.onbeforeunload = function() {
      localStorage.removeItem("Cart");
      return 'test';
    };
  */
}]);
