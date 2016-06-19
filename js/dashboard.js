
$(document).ready(function() {
    var myData = new Firebase("https://radiant-torch-3756.firebaseio.com");
    var productsNode = myData.child("products");


    function updateID(node){
        node.once("value", function(snapshot) {
            dataCount = snapshot.numChildren();
        });
    }

   //Google AUTH
    $("#click").click(function(){ 
     productsNode.authWithOAuthPopup("google", function(error, authData){
        if(error){
            console.log("Login fail" + error);
        }
        else{
            console.log("Authenticated successfullly with payload" + authData);
        }
    });
    console.log($(this) + "Clicked!");
    });
    

    $("#imageURL").keyup(function(event){
            if(event.keyCode == 13){
            $("#fabAdd").click();
            }
        });

    updateID(productsNode);
    $("#fabAdd").click(function(){ 
        $("#spinner").show(0).delay(1500).hide(0);
        updateID(productsNode);
        var push = productsNode.push({
            id: dataCount,
            name: $("#title").val(),
            img: $("#imageURL").val(),
            price: $("#price").val(), 
            brand: $("#Brand").val(),
            model: $("#Model").val(),
            operatingSystem: $("#OS").val()
        });

        var pushID = push.key();

        var randomNames = ["Nathan", "Abdel", "Someone", "Alex", "Samy", "Oemar","Dennis", "Kaan", "Bram"];
        var r = Math.floor(Math.random() * randomNames.length) + 0;  
        console.log(r);
        myData.child("/reviews").child(pushID).push({
                user: randomNames[r],
                comment: "This laptop is bad",
                rating: r
            
        });
        
            console.log("Data added");  
            
    });

	$(".Add").click(
		function(){
         $(this).parents().eq(1).addClass("mdl-shadow--16dp");
         var addedItem = $(this).closest("div").attr("id");
    	});

	$(".Remove").click(
		function(){
         $(this).parents().eq(1).removeClass("mdl-shadow--16dp");
         var removedItem = $(this).closest("div").attr("id");
    	});	

    $scope.loadProducts = function(){
        console.log("TEST");
    }
});
