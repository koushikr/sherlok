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
            if(sucesscallback) sucesscallback(response);
        });
    };
   

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
    
   function init(){
        console.log("Initing sherlock");
   }  

   
   
})(jQuery);