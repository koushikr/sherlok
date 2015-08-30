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
            var bidReference = getFirebaseReference().child("/approved_bids/"+sellable_bid_id);
            var bidMarked = 0
            bidReference.on("value", function(snapshot) {
                if(snapshot.val()) bidMarked = 1;
                if (bidMarked == 0){
                var seller_id_reference = fRef.child("/sellers/"+seller_id+"/products/"+product);
                seller_id_reference.on('value', function(product_snapshot){
                var sellable_product = product_snapshot.val();
                if(sellable_product && canProceed(value.price, sellable_product)){
                   console.log("Found product "+sellable_product);
                   $('.seller-wait-screen').addClass('hidden');
                   $('.seller-bid-screen').removeClass('hidden');
                   $('#seller_product_id').html(product.replace("_", " "));
                   $('#seller_min_price').html(sellable_product.min_price);
                   $('#customer_selected_price').html(value.price);
                   $('#bidId').val(snapshot.key());
                   updateSlider(value.price);
                }
                }, function(errorObject){ console.log("Seller Product Doesn't exist");
              });  
              }
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
       });
   }

   var updateSlider = function(price){
      var $element = $('input[id="seller-price"]');
      $element.attr({
        min: price - 1000,
        max: price + 1000,
        step: 100,
        value: price
      });
      
      project($element, 'seller-price');
      $element.rangeslider('update', true);

      $element = $('input[id="sla"]');
      $element.attr({
        min: 12,
        max: 48,
        step: 2,
        value: 24
      });
      
      project($element, 'sla');
      $element.rangeslider('update', true);
  }

  var project = function(element, id){
      element
      .rangeslider({
        polyfill: false,
        onInit: function() {
          $handle = $('.rangeslider__handle', this.$range);
          updateHandle($handle[0], this.value);
        }
      })
      .on('input', function() {
        updateHandle($handle[0], this.value);
      });

      function updateHandle(el, val) {
          $('#'+id).html(val);
      }
  }

   var canProceed = function(customer_requested_price, sellable_product){
        return (customer_requested_price < sellable_product.max_price && customer_requested_price > sellable_product.min_price);
   }

   var markAsBidded = function(bidId){
      var firebaseReference = getFirebaseReference().child("/approved_bids");
      var mydict = {}
      mydict[bidId] = { bidded : 1}
      firebaseReference.set(mydict);
   }

   // seller approving a product that she can deliver
   var productApprove = function(){
       $doc.on('click', '#seller-cta', function(e){
            var bidId = $('#bidId').val();
            var sla = $('#sla').html() ? $('#sla').html().split(" ")[0] : 12;
            var seller_distance = $('#seller_distance').val() ? $('#seller_distance').val() : 2;
            var seller_price = $('#seller_min_price').html();
            var seller_id = queryParams.seller_id ? queryParams.seller_id : "WT_Retail";
            var bidsReference = getFirebaseReference().child("/bids/"+bidId+"/sellers").push();            
            var max = 5; var min = 3;
            bidsReference.set({
              seller_id: seller_id,
              sla: sla,
              seller_price: seller_price,
              seller_distance: seller_distance,
              rating: Math.floor(Math.random() * (max - min + 1)) + min 
            });
            markAsBidded(bidId);
       });
   } 

})(jQuery);