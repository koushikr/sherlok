/*!
 * This is the jQuery event binder for sherlock.
 */

(function($){   
   var $doc = $(document);
   $doc.on('ready', init);
    
   // Init method when the page loads 
   function init(){
        console.log("Initing sherlock seller page");
        childAdded();
   }  

   // Get QueryParams from the url
   var queryParams = function () {
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = pair[1];
            } else if (typeof query_string[pair[0]] === "string") {
                query_string[pair[0]] = [ query_string[pair[0]], pair[1] ];
            } else {
                query_string[pair[0]].push(pair[1]);
            }
        }
        return query_string;
   } ();
   
   var childAdded = function(){
       var firebaseReference = getFirebaseReference().child("bids");
       firebaseReference.on("child_added", function(snapshot) {
            console.log("Child Has Been Changed " + snapshot.val());
            var value = snapshot.val();
            var seller_id = queryParams.seller_id ? queryParams.seller_id : "seller1";
            var product = value.product;
            firebaseReference.on("/seller/products/"+product, function(product_snapshot){
                var sellable_product = product_snapshot.val());

                if(sellable_product){
                   console.log("Found product "+sellable_product);
                   // Append to seller div here
                }
              }, function(errorObject){ console.log("Seller Product Doesn't exist");
            });
       });
   } 

})(jQuery);