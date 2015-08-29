 /*!
 * Components required for sherlock
 */

// Get Firebase Reference   
var getFirebaseReference = function(){
   return new Firebase("https://sherlok.firebaseio.com/"); 
}

// Get GeoFirebase Reference
var getGeoFireBaseReference = function(){
   return new GeoFire(getFirebaseReference()); // Geofire().ref === fireBaseReference 
}

/**
// Sample geo get and sets
var geoRef = new GeoFire(getFirebaseReference().child("/seller/seller1"));
geoRef.set("location", [37.79, -122.41]).then(function() {
  console.log("Provided key has been added to GeoFire");
}, function(error) {
  console.log("Error: " + error);
});
*/

// Load CSS files dynamically
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