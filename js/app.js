/*!
 * This is the jQuery event binder for sherlock.
 */

(function($){

  var customer = {}

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
        $('.register-screen').removeClass('hidden');
        processCustomerQuote();
        childChanged();
        registerUser();
   }  


   var processCustomerQuote = function(){
        $doc.on('click', '#screen1-cta', function(e){
            console.log("Setting Bid Reference");
            $('#product-info').addClass('hidden');
            $('#product-container').addClass('hidden');
            var product = $('#selectedProduct').val();
            var price = ($('#customer-price').html().split(" "))[1];
            if(customer.customer_id && price && product){
              var bidsReference = getFirebaseReference().child("bids").push();            
              bidsReference.set({
                  customer_id: customer.customer_id,
                  product: product,
                  price: price
              }); 
              $('.success-screen').removeClass('hidden');
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

   var registerUser = function(){
       $doc.on('click', '#register-cta', function(e){
           console.log("Registering the new user");
           customer.name = $('#registerName').val();
           customer.email = $('#registerEmail').val();
           customer.address = $('#registerAddress').val();
           customer.customer_id = customer.customer_id ? customer.customer_id : guid();
           console.log("Registered the user "+customer);
           $('.register-screen').addClass('hidden');
           $('.request-screen').removeClass('hidden')
       });
   }

   // Sorting the resultList by price
   var results = function(resultList){
      var newResults = resultList.slice(0);
      newResults.sort(function(a,b) { return a.seller_price - b.seller_price;});
      return newResults;
   }

   var guid = function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
   }
})(jQuery);