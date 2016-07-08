var app = angular.module('Webshop', ["firebase", "directives.card"]);

app.directive('onLastRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
                componentHandler.upgradeAllRegistered();
            }, 1);
        };//Controller start
    }).controller('CardsViewController', ["$scope", "$firebaseArray", function($scope, $firebaseArray){
    //Authentication Start
    var myData = new Firebase("https://radiant-torch-3756.firebaseio.com/");
     
    $("#googleLogin").hover(function(){
            $(this).attr("src", "img/google-signin-hovered.png");
        },
        function(){
            $(this).attr("src", "img/google-signin.png");
        });
    $(document).on( "click", ".login", function() {
         myData.authWithOAuthPopup("google", function(error, authData){
            if(error){
                console.error("Login fail" + error);
            }
            else{
                console.log("Authenticated successfullly with payload" + authData);
                console.dir(authData);
                $scope.authDataGlobal = authData;
                $(".userName").text(authData.google.displayName);
                $("#profilePicture").attr("src", authData.google.profileImageURL);
                /*$("#email").text(authData.google.email);*/
                $("#userInfo").fadeIn(100);
                $("#googleLogin").fadeOut(100);
                $(".addingReviewsWarning").hide();
                $(".addingReviews").show();
            }
        },{
            rememberMe: true,
            scope: "email"
        });

    });
    
    //Authentication end
	$scope.products = $firebaseArray(myData.child("products"));
    $scope.reviews = $firebaseArray(myData.child("reviews"));

	$scope.$on('onRepeatLast', function(scope, element, attrs){
        cartItems = [];
        chosenItems = JSON.parse(localStorage.getItem("Cart"));
        if(chosenItems){
            cartItems = chosenItems;
            updateCartStatus();
        }


        $("#count").removeClass("enter");
        $("#loadingBar").slideUp(400);
        $("#toast").slideUp();
        $("#Card").show();

       /*$("#count").attr("data-badge", cartItems.length);*/        
       function updateCartStatus(){
            for (var i = 0; i < cartItems.length; i++) {
                $(".card" + cartItems[i]).addClass("mdl-shadow--16dp");
            };
       }

       function showUndoToast(){
            //Toast 
            $("#toast").slideDown().children("#toastText").text("Item added");
            $("#toastAction").show();
            setTimeout(function(){$("#toast").slideUp(); $("#fab").toggleClass("fabUp fabDown");}, 2000);
            $("#fab").toggleClass("fabUp fabDown");
       }


        $("#toastAction").click(function(){ 
            $(".card" + cartItems[cartItems.length -1]).removeClass("mdl-shadow--16dp");
            cartItems.pop();
            $("#toast").slideUp();
            console.log("i got clicked" + cartItems);
        });

        //Showing extra info button
        $(".productsContainer").on("click", ".info", function() {
            $(this).parents().eq(1).children().eq(1).toggle();
            $(this).parents().eq(1).children().eq(2).toggle();
            $(this).parents().eq(1).children().eq(3).toggle();
            $(this).children().eq(0).html(function(_, text) {return text === 'info_outline' ? 'close' : 'info_outline';});
            console.log("click");
        });
        //Adding items
        $(".productsContainer").on("click", ".Add", function() {
            var addedItemID = $(this).closest("div").attr("id");
            cartItems.push(addedItemID);
            updateCartStatus();
            console.log("Item: " + addedItemID + " turned into true");
            showUndoToast();
            /*$(this).attr('disabled', '').siblings().removeAttr('disabled');*/
        });
        //Removing items
        $(".productsContainer").on("click", ".Remove", function() {
            $(this).parents().eq(1).removeClass("mdl-shadow--16dp");
            var removedItemID = $(this).closest("div").attr("id");
            //Removing item from local array
            cartItems.splice((cartItems.indexOf(removedItemID.toString())),1);
            //Updating local storage with the local array
            localStorage.setItem("Cart", JSON.stringify(cartItems));
            console.log("Item: " + removedItemID + " turned into false");
            /*$(this).attr('disabled', '').siblings().removeAttr('disabled');*/
        });
        //Checkout
        $("#fab").click(function(){ 
            setTimeout(function() {location.href = "checkout.html";}, 300);
            localStorage.setItem("Cart", JSON.stringify(cartItems));
        });
        //Count
        $("#count").click(function(){ 
            location.href = "checkout.html";
            localStorage.setItem("Cart", JSON.stringify(cartItems));    
        });
        //Adding reviews
        $(".productsContainer").on("click", ".addComment", function() {
            myData.child("reviews/").child($(this).siblings("input").attr("class")).push({
                user: $scope.authDataGlobal.google.displayName,
                comment: $(this).siblings("input").val(),
                rating: Math.floor(Math.random() * 10) + 1  
            });
        });
        console.log("items repeated!");
    });
}]);

var checkout = angular.module('checkOut', ["firebase"]);

checkout.directive('onLastRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
                componentHandler.upgradeAllRegistered();
            }, 1);
        };
    }).controller('displayTable', ["$scope", function($scope){
    $scope.$on('onRepeatLast', function(scope, element, attrs){
        $("#loadingBar").slideUp(400);
        $("#myTable").fadeIn();
    });
    
    $("#Card").show();
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
            $("#Card").css('height', 'auto');
        }
        else{
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
      return 'tesT';
    };
*/
}]);
