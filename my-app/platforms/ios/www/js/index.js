var map;
var points_table = null;
var points_table_shape = null;
var lines_table_shape = null;
var points_table_event_listener = null;
var update_timeout = null;
var checkStickStatus = null;
var entire_path = null;
var pathNumber=0;

var pointsCounter = 0;

var saved_roads = null;

var response_table = null;

var data = {};




var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        //TODO: jak ogarne jak pobrac rozmiar ekranu to tu to zmienie, narazie na sztywno
        var div = document.createElement("div");
        div.id="map";
        div.style.width = "320px";
        div.style.height = "450px";
        document.body.appendChild(div);




        //navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
        initializeMap();
    },


};
function initializeMap(){
     points_table = new Array();
     points_table_shape = new Array();
     saved_roads = new Array();
     lines_table_shape = new Array();
     response_table = new Array();
     entire_path = new Array();
     

     var mapOptions = {
        center:new google.maps.LatLng(52.068165,20.076803),
        zoom:6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
        
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListener(map, 'click', function(e){
        update_timeout = setTimeout(function(){
            points_table.push(e.latLng);
            drawPoint(e.latLng);
            pointsCounter++;

        }, 200); 

    });
}
function drawPoint(pointLatLng){
    var marker = new google.maps.Marker({
        position: pointLatLng,
        icon:{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 4,
            strokeColor: "#0000FF",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "red",
            fillOpacity: 0.4
        },
        map: map
    });
}