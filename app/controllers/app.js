(function($){

var constants = {
    
};

var $doc = $(document);
$doc.on('ready', init);

function init(){
    
}

var call_ajax = function (url, dataType, data, requestType, sucesscallback, failurecallback){
    var ajax = $.ajax({
        url: url,
        dataType: dataType,
        type : requestType,
        data : data,
        contentType: "application/json",
        processData: false, // avoid the data being parsed to query string params
        error : failurecallback,
    });

    ajax.success(function(response){
        if(sucesscallback) sucesscallback(response);
    });
};


})(jQuery);