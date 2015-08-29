/*!
 * This is the jQuery event binder for sherlock.
 */

(function($){

   // Get QueryParams from the url
   // Usage -- var page_id = queryParams.page ? queryParams.page : "seller_1";
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

   // Make an AJAX call with bindings
   var call_ajax = function (url, dataType, data, requestType, sucesscallback, failurecallback){
        var ajax = $.ajax({
            url: url,
            dataType: dataType,
            type : requestType,
            data : data,
            contentType: "application/json",
            processData: false, // avoid the data being parsed to query string params
            error : failurecallback,
            beforeSend : function(){
                $("#loading-indicator").show();
            }
        });

        ajax.success(function(response){
            if(sucesscallback) sucesscallback(response);
        });
    };

   // To dynamically load a javascript
   var require = function(script_url, dataType){
        var req = $.ajax({
            url: script_url,
            dataType: 'script',
            async: false
        });

        req.success(function(response){
             console.log("Loaded script with url..." + script_url);   
        });

        req.error(function(response){
                console.log("Failed to load the script..."+ script_url);
        });    
   }
   
   
   var $doc = $(document);
   $doc.on('ready', init);
    
   // Init method when the page loads 
   function init(){
        console.log("Initing sherlock");
        processCustomerQuote();
        childChanged();
   }  


   var processCustomerQuote = function(){
        $doc.on('click', '#screen1-cta', function(e){
            console.log("Setting Bid Reference");
            var customer_id = "test_customer_id";
            var product = $('#exampleInputEmail1').val();
            var price = $('#customer-price').html();
            if(customer_id && price && product){
              var bidsReference = getFirebaseReference().child("bids").push();            
              bidsReference.set({
                  customer_id: customer_id,
                  product: product,
                  price: price
              });  
            }
        });
   }

   var childChanged = function(){
       var firebaseReference = getFirebaseReference().child("bids");
       firebaseReference.on("child_changed", function(snapshot) {
            console.log("Child State Has Changed");
            console.log(snapshot.val());
            // check of sellers being present or not..
            // if present loop through all of them and
            // Append to customer div here
       });
   }

   // Sorting the resultList by price
   var results = function(resultList){
      var newResults = resultList.slice(0);
      newResults.sort(function(a,b) { return a.seller_price - b.seller_price;});
      return newResults;
   }

})(jQuery);