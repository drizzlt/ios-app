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
var howManySaved=0;

var directionsService;
var geocoder;
var selectedActivity = null;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        doOnOrientationChange();
        window.addEventListener('orientationchange', doOnOrientationChange);
        
        initializeMap();

    },


};
 function doOnOrientationChange(){
    switch(window.orientation) 
    {  
      case -90:
      case 90:
        resolution_handling("landscape");
        break; 
      default:
        resolution_handling("portrait");
        break; 
    }

}
function initializeMap(){
     points_table = new Array();
     points_table_shape = new Array();
     saved_roads = new Array();
     lines_table_shape = new Array();
     response_table = new Array();
     entire_path = new Array();
     directionsService = new google.maps.DirectionsService();
     geocoder = new google.maps.Geocoder();
     checkStickStatus = 1;
     selectedActivity =1;
     calcCalories(totalDistance());
     howManySaved= localStorage.getItem("saveNumber");
     var mapOptions = {
        center:new google.maps.LatLng(52.068165,20.076803),
        zoom:6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };        
    $(document).on('change', "input[name*='radio-choice-']", function(){ 
        var choice = $(this).val();
        if(choice=="choice-1"){
            selectedActivity=1;
            calcCalories(totalDistance());
        }
        else if(choice=="choice-2"){
            selectedActivity=2;
            calcCalories(totalDistance());
        }
        else if(choice=="choice-3"){
            selectedActivity=3;
            calcCalories(totalDistance());
        }
        else if(choice=="choice-4"){
            selectedActivity=4;
            calcCalories(totalDistance());
        }
        else if(choice=="choice-5"){
           selectedActivity=5;
           calcCalories(totalDistance());
        }
        
    });  
    $(document).on('change', "input[name*='radio3-choice-']", function(){ 
        var choice = $(this).val();
        if(choice=="choice-1"){
            theme_handling("a");
        }
        if(choice=="choice-2"){
            theme_handling("b");
        }
    });
    $( "#weight" ).bind( "change", function(event, ui) {
        calcCalories(totalDistance());
    });
     $("#search").bind( "keyup change", function() {
        var loc = this.value;

        geocoder.geocode( { 'address': loc}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.fitBounds(results[0].geometry.viewport);
            }
        });
    });
    $(document).on('change', "input[name*='radio2-choice-']", function(){ 
        var choice = $(this).val();
        if(choice=="choice-1"){
            checkStickStatus=1;
        }
        else{
            checkStickStatus=0;
        }
        
    });  
        
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListener(map, 'click', function(e){
        update_timeout = setTimeout(function(){
            points_table.push(e.latLng);
            drawPoint(points_table,e.latLng, "Null", "Null", 2);
            pointsCounter++;
            if(points_table.length>1){
                
                if(checkStickStatus){
                                      //calcRoute(points_table);
                    entire_path = new Array();
                    calcRoute(points_table[points_table.length-2], points_table[points_table.length-1], function(results){

                        response_table.push(results);
                        //var routePath = results.routes[0].overview_path;
                        var table=[];
                        var legPath = results.routes[0].legs[0];
                        var wp = legPath.via_waypoints 
                        
                        for(var i=0; i<legPath.steps.length;i++){
                            for(var j=0; j< legPath.steps[i].path.length;j++){
                                //alert(legPath.steps[i].path[j]);
                                entire_path.push(legPath.steps[i].path[j]);
                            }
                            
                        }
                        
                           // alert(legPath);
                            //entire_path.push(table)
                            //drawLine(entire_path);
                            var l = points_table[points_table.length-1];
                            removeLastPoint();
                            
                            
                            
                            for(var i =0; i < entire_path.length; i++){
                               
                                
                                points_table.push(entire_path[i]);
                                drawPoint(points_table, entire_path[i], pathNumber, "Null", 2);
                                pointsCounter++;
                                
                            }
                            points_table.push(l);
                            drawPoint(points_table, l, "Null", "Null", 2);
                            pointsCounter++;
                            
                            drawLine(points_table, 1);
                            pathNumber++;
                        
                        

                    });
                    
                
                }
                else{
                    
                    drawLine(points_table, 1);
                }
                
            
            }

        }, 200); 

    });
    google.maps.event.addListener(map, 'dblclick', function(event) {       
        clearTimeout(update_timeout);
    });
    showDistance();

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

    });
    if(where!="Null"){
        points_table_shape.insert(where, marker)
    }
    else
        points_table_shape.push(marker);
    
    if(marker.pathNumber == "Null")
        marker.setMap(map);

    google.maps.event.addListener(marker, 'click', function(e){
        
        alert(marker.id+ " + " + marker.position);

    });
    google.maps.event.addListener(marker, 'drag', function(e){
        
        points_table[marker.id] = e.latLng;   
        drawLine(points_table, 1);
    });
    google.maps.event.addListener(marker, 'dragend', function(e){
        var counter=0;
        var firstPoint=null;
        var firstPointShape=null;
        var tempMarker = marker;

        var counter2 =0;
        var firstPoint2 =null;
        if(marker.id == 0){
            firstPoint=null;
            counter=0;
            if(!(points_table_shape[marker.id].pathNumber == points_table_shape[marker.id+1].pathNumber)){
                
                if(points_table_shape[marker.id+1].pathNumber == points_table_shape[marker.id+2].pathNumber){

                    for(i in points_table_shape){
                        if(points_table_shape[i].pathNumber==points_table_shape[marker.id+1].pathNumber){
                            counter++;
                        }
                    }
                    for(i in points_table_shape){
                        if(points_table_shape[i].pathNumber==points_table_shape[marker.id+1].pathNumber){
                            firstPoint = points_table_shape[i].id;
                            break;
                        }
                    }
                    counter--;
                    if(counter>1){

                        
                        for(var i = firstPoint+counter; i< points_table_shape.length;i++){
                            points_table_shape[i].id -= counter;
                            if(points_table_shape[i].pathNumber != "Null"){
                                points_table_shape[i].pathNumber--;
                            }
                        }
                        deletePoints(firstPoint, counter, marker.id);
                        pathNumber = 0;
                        pointsCounter=0;
                        for(var i = 1; i< points_table_shape.length; i++){
                            if(points_table_shape[i].pathNumber!="Null"){
                                points_table_shape[i].pathNumber=pathNumber;
                            }
                            else
                                pathNumber++;
                        }
                        for(var i = 0; i< points_table_shape.length; i++){
                           points_table_shape[i].id = pointsCounter;
                           points_table_shape[i].title = pointsCounter;
                           pointsCounter++;
                        }
                        drawLine(points_table, 1);
                        
                        calcRoute(points_table_shape[marker.id].position, points_table_shape[marker.id+1].position, function(results){
                            entire_path = new Array();
                            response_table.push(results);
                            var legPath = results.routes[0].legs[0];
                            for(var i=0; i<legPath.steps.length;i++){
                                for(var j=0; j< legPath.steps[i].path.length;j++){
                                    
                                    entire_path.push(legPath.steps[i].path[j]);
                                }
                                
                            }

                            pointsCounter = entire_path.length-1;
                            
                           
                            for(var i =0; i<entire_path.length-1; i++, pointsCounter--){
                                  
                                
                                points_table.insert(marker.id+1, entire_path[entire_path.length-1-i]);
                                drawPoint(points_table, entire_path[entire_path.length-1-i], pathNumber, marker.id+1, 2);
                                
                            }

                            calculatePointsParemeters();
                            drawLine(points_table, 1);
                            
                        });


                    }


                }
            }
        }
        if(marker.id!=0 && marker.id!=points_table.length-1){
            //pierwszy punkt
            if(!(points_table_shape[marker.id-1].pathNumber == points_table_shape[marker.id].pathNumber)){
                
                if(points_table_shape[marker.id-1].pathNumber == points_table_shape[marker.id-2].pathNumber){

                    for(i in points_table_shape){
                        if(points_table_shape[i].pathNumber==points_table_shape[marker.id-1].pathNumber){
                            counter++;
                        }
                    }
                    for(i in points_table_shape){
                        if(points_table_shape[i].pathNumber==points_table_shape[marker.id-1].pathNumber){
                            firstPoint = points_table_shape[i].id;
                            break;
                        }
                    }
                   
                    if(counter>1){

                        
                        for(var i = firstPoint+counter; i< points_table_shape.length;i++){
                            points_table_shape[i].id -= counter;
                            if(points_table_shape[i].pathNumber != "Null"){
                                points_table_shape[i].pathNumber--;
                            }
                        }
                        deletePoints(firstPoint, counter, marker.id);
                        drawLine(points_table, 1);
                        pathNumber--;

                        calcRoute(points_table_shape[marker.id-1].position, points_table_shape[marker.id].position, function(results){
                            entire_path = new Array();
                            response_table.push(results);
                            var legPath = results.routes[0].legs[0];
                            for(var i=0; i<legPath.steps.length;i++){
                                for(var j=0; j< legPath.steps[i].path.length;j++){
                                    
                                    entire_path.push(legPath.steps[i].path[j]);
                                }
                                
                            }
                          
                         
                            pointsCounter = entire_path.length-1;
                            
                            
                            for(var i =0; i<entire_path.length-1; i++, pointsCounter--){
                                  
                                
                                points_table.insert(marker.id, entire_path[entire_path.length-1-i]);
                                drawPoint(points_table, entire_path[entire_path.length-1-i], pathNumber, marker.id, 2);
                                
                            }
                 
                            calculatePointsParemeters();
                            drawLine(points_table, 1);
                            
                        });


                    }


                }
            }
            //drugi punkt
            firstPoint=null;
            counter=0;
            if(!(points_table_shape[marker.id].pathNumber == points_table_shape[marker.id+1].pathNumber)){
                
                if(points_table_shape[marker.id+1].pathNumber == points_table_shape[marker.id+2].pathNumber){

                    for(i in points_table_shape){
                        if(points_table_shape[i].pathNumber==points_table_shape[marker.id+1].pathNumber){
                            counter++;
                        }
                    }
                    for(i in points_table_shape){
                        if(points_table_shape[i].pathNumber==points_table_shape[marker.id+1].pathNumber){
                            firstPoint = points_table_shape[i].id;
                            break;
                        }
                    }
                    counter--;
                    if(counter>1){

                        
                        for(var i = firstPoint+counter; i< points_table_shape.length;i++){
                            points_table_shape[i].id -= counter;
                            if(points_table_shape[i].pathNumber != "Null"){
                                points_table_shape[i].pathNumber--;
                            }
                        }
                        deletePoints(firstPoint, counter, marker.id);
                        pathNumber = 0;
                        pointsCounter=0;
                        for(var i = 1; i< points_table_shape.length; i++){
                            if(points_table_shape[i].pathNumber!="Null"){
                                points_table_shape[i].pathNumber=pathNumber;
                            }
                            else
                                pathNumber++;
                        }
                        for(var i = 0; i< points_table_shape.length; i++){
                           points_table_shape[i].id = pointsCounter;
                           points_table_shape[i].title = pointsCounter;
                           pointsCounter++;
                        }
                        drawLine(points_table, 1);
                        
                        calcRoute(points_table_shape[marker.id].position, points_table_shape[marker.id+1].position, function(results){
                            entire_path = new Array();
                            response_table.push(results);
                            var legPath = results.routes[0].legs[0];
                            for(var i=0; i<legPath.steps.length;i++){
                                for(var j=0; j< legPath.steps[i].path.length;j++){
                                    
                                    entire_path.push(legPath.steps[i].path[j]);
                                }
                                
                            }

                            pointsCounter = entire_path.length-1;
                            
                           
                            for(var i =0; i<entire_path.length-1; i++, pointsCounter--){
                                  
                                
                                points_table.insert(marker.id+1, entire_path[entire_path.length-1-i]);
                                drawPoint(points_table, entire_path[entire_path.length-1-i], pathNumber, marker.id+1, 2);
                                
                            }

                            calculatePointsParemeters();
                            drawLine(points_table, 1);
                            
                        });


                    }


                }
            }
        }
        if(marker.id ==points_table.length-1){
            var counter=0;
            var firstPoint=null;
            var firstPointShape=null;
            var tempMarker = marker;
            pointsCounter = points_table_shape.length;
            if(!(points_table_shape[marker.id-1].pathNumber == points_table_shape[marker.id].pathNumber)){
                
                if(points_table_shape[marker.id-1].pathNumber == points_table_shape[marker.id-2].pathNumber){

                    for(i in points_table_shape){
                        if(points_table_shape[i].pathNumber==points_table_shape[marker.id-1].pathNumber){
                            counter++;
                        }
                    }

                    for(i in points_table_shape){
                        if(points_table_shape[i].pathNumber==points_table_shape[marker.id-1].pathNumber){
                            firstPoint = points_table_shape[i].id;
                            break;
                        }
                    }
                
                    if(counter>1){
                        marker.id -=counter;
                        deletePoints(firstPoint, counter, marker.id);

                        pointsCounter= points_table_shape.length;
                       

                        entire_path = new Array();
                        calcRoute(points_table[points_table.length-2], points_table[points_table.length-1], function(results){

                            response_table.push(results);
                            
                            var table=[];
                            var legPath = results.routes[0].legs[0];
                            var wp = legPath.via_waypoints 
                              
                            for(var i=0; i<legPath.steps.length;i++){
                                for(var j=0; j< legPath.steps[i].path.length;j++){
                                    
                                    entire_path.push(legPath.steps[i].path[j]);
                                }
                                
                            }
                          
                            var l = points_table[points_table.length-1];
                            removeLastPoint();
                            
                            
                            
                            for(var i =0; i < entire_path.length; i++){
                               
                                
                                points_table.push(entire_path[i]);
                                drawPoint(points_table, entire_path[i], pathNumber, "Null", 2);
                                pointsCounter++;
                                
                            }
                            points_table.push(l);
                            drawPoint(points_table, l, "Null", "Null",2);
                            pointsCounter++;
                            

                            drawLine(points_table, 1);
                            pathNumber++;


                        });  
                    }
                    
                }
            }
        }
        
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
    showDistance();
    calcCalories(totalDistance());
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
function deletePoints(start, quantity, markerId){
    
    for(i=start; i<=quantity; i++){
        points_table_shape[i].setMap(null);

    }
    

    points_table_shape[markerId].id = points_table_shape.length-1-quantity;
    points_table.splice(start,quantity);
    points_table_shape.splice(start, quantity);  
    pathNumber--;
}
function deletePoint(point){
    points_table.splice(point,1);
    points_table_shape[point].setMap(null);
    points_table_shape.splice(point, 1);  
    pointsCounter--;
    for(i=point; i< points_table_shape.length; i++){
        points_table_shape[i].id --;
        points_table_shape[i].title --;
    }
}
function removeLastPoint(){
    var counter= 0;
    if(points_table_shape.length>1){
        if(points_table_shape[points_table_shape.length-2].pathNumber=="Null" && points_table_shape[points_table_shape.length-1].pathNumber=="Null"){
            if (points_table.length>0) {
                points_table.pop();
                points_table_shape[points_table_shape.length-1].setMap(null);
                points_table_shape.pop();
                pointsCounter--;
                drawLine(points_table, 1);
            }
        }
        else{
            for(i=0;i<points_table_shape.length; i++){
                if(points_table_shape[i].pathNumber == points_table_shape[points_table_shape.length-2].pathNumber){
                    counter++;
                }
            }
            for(i =0; i<=counter; i++){
                if (points_table.length>0) {
                    points_table.pop();
                    points_table_shape[points_table_shape.length-1].setMap(null);
                    points_table_shape.pop();
                    pointsCounter--;
                    
                }

            }
            drawLine(points_table, 1);
        }
    }
}
function clearTables(){
    var state = confirm("Are you SURE?");
    if(state){
        for(i=0; i< points_table_shape.length; i++){
            points_table_shape[i].setMap(null);
        }
        for(i=0; i< lines_table_shape.length; i++){
            lines_table_shape[i].setMap(null);
        }

        points_table = new Array();
        points_table_shape = new Array();
        lines_table_shape = new Array();
        pointsCounter=0;
        showDistance();
    }

}
function showDistance(){
    featureLength = totalDistance();
    document.getElementById("length").innerHTML = featureLength.toFixed(2) + " km   "+" " ;
    document.getElementById("distance").innerHTML = featureLength.toFixed(2) + " km   "+" " ;
}
function totalDistance(){
    var dist=0.0;
    for(var i=1; i<points_table.length; i++){
        var point1 = points_table[i-1];
        var point2 = points_table[i];
        
        dist += google.maps.geometry.spherical.computeDistanceBetween(point1, point2)/1000;
    }
    return dist;
}
function search(){
    var loc = document.getElementById('address').value;

    geocoder.geocode( { 'address': loc}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.fitBounds(results[0].geometry.viewport);
        }
    });  
}
function checkStick(){

    //$('#yourid').attr('name')
    
    var checkedValue = document.getElementById("stickToRoadCheckbox");
    if(checkedValue.checked)
        return 1;
    else
        return 0;
}
function toggleStick(){
    var checkedValue = document.getElementById("stickToRoadCheckbox");
    if(checkedValue.checked){
        checkStickStatus=1;
    }
    else{
        checkStickStatus=0;
    }

}
function calcRoute(startPoint, stopPoint , callback) {
   

    var request = {
        origin:startPoint,
        destination:stopPoint,
        travelMode: google.maps.TravelMode.WALKING
    };
    directionsService.route(request, function(response, status) {

        if (status == google.maps.DirectionsStatus.OK)
            callback(response);
        else { 
            alert("Directions request failed:" + status); 
        }

    });
    
}
function calculatePointsParemeters(){
    pathNumber = 0;
    pointsCounter=0;
    for(var i = 1; i< points_table_shape.length; i++){
        if(points_table_shape[i].pathNumber!="Null"){
            points_table_shape[i].pathNumber=pathNumber;
        }
        else
            pathNumber++;
    }
    for(var i = 0; i< points_table_shape.length; i++){
       points_table_shape[i].id = pointsCounter;
       points_table_shape[i].title = pointsCounter;
       pointsCounter++;
    }
}
function calcCalories(distance){
  

    var calories = 0;
    if(document.getElementById("weight")!=null)
        var weight  = document.getElementById("weight").value;    
    if(weight>0){
        if(selectedActivity == "1"){
            calories = distance*weight+(0.08*weight)*distance;
            document.getElementById("calories").innerHTML = calories.toFixed(2) + " kcal";
        }
        else if(selectedActivity == "2"){
            calories = distance*weight+(0.78*weight)*distance;
            document.getElementById("calories").innerHTML = calories.toFixed(2) + " kcal";
        }
        else{
            calories = distance*weight+(0.08*weight)*distance;
            if(document.getElementById("calories")!=null)
                document.getElementById("calories").innerHTML = calories.toFixed(2) + " kcal";
        }
    }
    else{
        document.getElementById("calories").innerHTML = "Check Personal Options first"
    }

    return calories;
}
function generateJson(){

    
   var jsonString = {};
   var points = [];
   jsonString.points = points;
    for(var i =0; i<points_table_shape.length;i++){
        var point = {
            "position": points_table_shape[i].position,
            "pathNumber": points_table_shape[i].pathNumber,
            "id": points_table_shape[i].id,
            
        }
        jsonString.points.push(point);
   }
    jsonString = JSON.stringify(jsonString);
    return jsonString;

    
    //window.open( "data:text/json;charset=utf-8," + escape(jsonString));
}
function saveRoad(){
    //alert(localStorage.getItem("saveNumber"));
    if (typeof(localStorage) == 'undefined' ) {
        alert('Your browser does not support HTML5 localStorage. Try upgrading.');
    } 
    else {
        if(points_table.length>1){
            try {
                howManySaved++;
                localStorage.setItem("saveNumber", howManySaved); //saves to the database, "key", "value"
                localStorage.setItem(howManySaved, generateJson());
            } catch (e) {
                 if (e == QUOTA_EXCEEDED_ERR) {
                     alert('Quota exceeded!'); //data wasn't successfully saved due to quota exceed so throw an error
                }
            }
            //localStorage.removeItem("saveNumber"); //deletes the matching item from the database
            //localStorage.removeItem("saveNumber");
            //howManySaved=0;
        }
        else{
            alert("nothing to save");
        }
    }
}
function loadRoad(){
    var road = localStorage.getItem(howManySaved);
    loadCurrentRoad(road);
}
function loadCurrentRoad(json){
    points_table = new Array();
    points_table_shape = new Array();
    var json_table = JSON.parse(json);

    var points_table_temp = [];
    var tempPoint1; 
    var tempPoint2; 
    var latLng;
    var pathNumber;

    pointsCounter=0;
    for(i=0; i<json_table.points.length; i++){
        tempPoint1 = json_table.points[i].position.ob;
        tempPoint2 = json_table.points[i].position.pb;
        pathNumber = json_table.points[i].pathNumber;
        latLng = new google.maps.LatLng(tempPoint1,tempPoint2);
        points_table.push(latLng);
        //drawPoint(points_table,points_table[i], pathNumber, "Null", 2);
        pointsCounter++;

    }
    drawLine(points_table,1);

}





