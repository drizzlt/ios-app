function resolution_handling() {
    //pobierz rozmiary
    var buttonSize = {
        width  : $("#buttonLeft").css("width").split("px")[0],
        height : $("#buttonLeft").css("height").split("px")[0]
    };
    //ustaw rozmiary
    var viewport = {
        width  : $(window).width(),
        height : $(window).height()-((buttonSize.height)*3)
    };
    
    $("#mpa").css("width", viewport.width+"px");
    $("#map").css("height", viewport.height+"px");

    $("#buttonLeft").css("width", ((viewport.width*1/3)-20)+"px" );
    $("#buttonRight").css("width", ((viewport.width*1/3)-20)+"px" );
    $("#panelCenter").css("width", ((viewport.width*1/3)-12)+"px" );
    $("#panelCenter").css("height", buttonSize.height+"px");
}