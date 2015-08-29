var CSS = {
    load : function(filename){
        var fileref=document.createElement('link');
        fileref.setAttribute('rel', 'stylesheet');
        fileref.setAttribute('type', 'text/css');
        fileref.setAttribute('href', filename);
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
};
CSS.load("");

var getFirebaseReference = function(){
       return new Firebase("https://sherlok.firebaseio.com/"); 
}


