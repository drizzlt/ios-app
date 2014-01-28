var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);

    },
    onSuccess: function(position){
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        var latLong = new google.maps.LatLng(latitude, longitude);
       
        var mapOptions = {
            center: latLong,
            zoom:6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(document.getElementById("geolocation"), mapOptions);
        alert("succes");
    },
    onError: function(error){
        alert("errror");
    },

};
