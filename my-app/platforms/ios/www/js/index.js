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
            drawPoint(points_table,e.latLng, "Null", "Null", 2);
            pointsCounter++;
            if(points_table.length>1){
                drawLine(points_table,1);
            }

        }, 200); 

    });
    google.maps.event.addListener(map, 'dblclick', function(event) {       
        clearTimeout(update_timeout);
    });

}
function drawPoint(points_table,pointLatLng, pNumber, where, color){
    var style_table = [];
    style_table = setPointStyle(color);
    var scale = style_table[0];
    var strokeColor = style_table[1];
    var strokeOpacity = style_table[2];
    var strokeWeight = style_table[3];
    var fillColor = style_table[4];
    var fillOpacity = style_table[5];

    var marker=new google.maps.Marker({
        position:pointLatLng,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: scale,
            strokeColor: strokeColor,
            strokeOpacity: strokeOpacity,
            strokeWeight: strokeWeight,
            fillColor: fillColor,
            fillOpacity: fillOpacity
        },
        draggable:true,
        idInitial: pointsCounter,
        id: pointsCounter,
        pathNumber: pNumber,
        title: ""+pointsCounter,
        map: map

    });
    if(where!="Null"){
        points_table_shape.insert(where, marker)
    }
    else
        points_table_shape.push(marker);

    google.maps.event.addListener(marker, 'click', function(e){
        
        alert(marker.id+ " + " + marker.position);

    });
    google.maps.event.addListener(marker, 'drag', function(e){
        
        points_table[marker.id] = e.latLng;   
        drawLine(points_table, 1);
    });

}
function drawLine(points_table, color){
    var style_table = [];
    style_table=  setLineStyle(color); 
    for(i=0; i<lines_table_shape.length; i++){
        lines_table_shape[i].setMap(null);
    }

    for(i=0; i<lines_table_shape.length; i++){
        lines_table_shape.pop();
    }
        
    var path = new google.maps.Polyline({
        path: points_table,
        strokeColor: style_table[0],
        strokeOpacity: style_table[1],
        strokeWeight: style_table[2],
    });
    lines_table_shape.push(path);
    path.setMap(map);
    //showDistance();
}
function setPointStyle(number){
    var style_table = [];

    if(number ==1){
        style_table[0]= "#0000FF";
        style_table[1] = 0.8;
        style_table[2] = 2;
        style_table[3] = "#0000FF";
        style_table[4] = 0.4;
    }
    if(number ==2){
        style_table[0]= 3; //scale
        style_table[1]= "#0000FF"; //strokeColor
        style_table[2] = 0.8; //strokeOpacity
        style_table[3] = 2; //strokeWeight
        style_table[4] = "red";//fillColor
        style_table[5] = 0.4; //fillOpacity
    }
    return style_table;


}
function setLineStyle(number){

    var style_table = [];
    if(number == 1){
        style_table[0]= '#0000ff'; //strokeColor
        style_table[1]= 0.5; // strokeOpacity
        style_table[2]= 5; //strokeWeight
    }
    if(number == 2){
        style_table[0]= '#6CF'; //strokeColor
        style_table[1]= 0.5; // strokeOpacity
        style_table[2]= 5; //strokeWeight
    }
    return style_table;
    
}
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};
