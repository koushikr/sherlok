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
        productApprove();
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
       var fRef = getFirebaseReference();
       var firebaseReference = fRef.child("bids");
       firebaseReference.on("child_added", function(snapshot) {
            console.log("Child Has Been Changed " + snapshot.val());
            var value = snapshot.val();
            var seller_id = queryParams.seller_id ? queryParams.seller_id : "seller1";
            var product = value.product;
            var sellable_bid_id = snapshot.key();
            var seller_id_reference = fRef.child("/sellers/"+seller_id+"products/"+product);
            seller_id_reference.on('value', function(product_snapshot){
                var sellable_product = product_snapshot.val();
                if(sellable_product && canProceed(product.price, sellable_product)){
                   console.log("Found product "+sellable_product);
                   // Append to seller div here - use sellable_bid_id
                }
              }, function(errorObject){ console.log("Seller Product Doesn't exist");
            });
       });
   }

   var canProceed = function(customer_requested_price, sellable_product){
        return (customer_requested_price < sellable_product.max_price && customer_requested_price > sellable_product.min_price);
   }

   // seller approving a product that she can deliver
   var productApprove = function(){
       $doc.on('click', '#seller_approve', function(e){
            var bidId = $('#bid_id').val();
            var sla = $('#sla').val();
            var seller_distance = $('#seller_distance').val();
            var seller_price = $('#seller_price').val();
            var seller_id = queryParams.seller_id ? queryParams.seller_id : "seller1";
            var bidsReference = getFirebaseReference().child("/bids/"+bidId+"/sellers").push();            
            var max = 5; var min = 3;
            bidsReference.set({
              seller_id: seller_id,
              sla: sla,
              seller_price: seller_price,
              seller_distance: seller_distance,
              rating: Math.floor(Math.random() * (max - min + 1)) + min 
            });
       });
   } 

})(jQuery);