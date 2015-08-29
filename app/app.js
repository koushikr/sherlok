(function($){

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
            $("#loading-indicator").hide();
            if(sucesscallback) sucesscallback(response);
        });
    };
   
   var require = function(script_url, dataType){
        $.ajax({
            url: script,
            dataType: 'script',
            async: false,
            success = function(){
                console.log("Loaded script with url..." + script_url);
            },

            error: function(){
                console.log("Failed to load the script..."+ script_url);
            }    
        });
   }
   
   require("./firebase.js");
   var $doc = $(document);
   $doc.on('ready', init);
   var firebaseRef = null;

   function init(){
       get_firebase_reference();                 
       binder();


   }


   var binder = function(){
        $('cloc')
   };

   var get_firebase_reference = function(){
        firebaseRef = new Firebase("https://sherlok.firebaseio.com/");
   }
})(jQuery);