function resolution_handling(mode) {
    //pobierz rozmiary
    var buttonSize = {
        width  : $("#buttonLeft").css("width").split("px")[0],
        height : $("#buttonLeft").css("height").split("px")[0]
    };
    //ustaw rozmiary
    var viewport;
    if(mode=="portrait"){
        viewport = {
            width  : $(window).width(),
            height : $(window).height()-((buttonSize.height)*3)
        };
    }
    else{
         viewport = {
            width  : $(window).height(),
            height : $(window).width()-((buttonSize.height)*3)
        };
    }
    $("#mpa").css("width", viewport.width+"px");
    $("#map").css("height", viewport.height+"px");
    $("#page").css("height", viewport.height+"px");
    $("#page").css("width", viewport.width+"px");

    $("#buttonLeft").css("width", ((viewport.width*1/3)-20)+"px" );
    $("#buttonRight").css("width", ((viewport.width*1/3)-20)+"px" );
    $("#panelCenter").css("width", ((viewport.width*1/3)-12)+"px" );
    $("#panelCenter").css("height", buttonSize.height+"px");
}
function theme_handling(change){
    
    $( "#buttonLeft" ).buttonMarkup({theme: change});
    $( "#buttonRight" ).buttonMarkup({theme: change});

    $('[data-role=collapsible-set]').collapsibleset("option", "theme", change );
    $('[data-role=collapsible]').collapsible("option", "theme", change );

}