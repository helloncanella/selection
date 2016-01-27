function positionBaloon(position) {
  var subtitle = $('.player-timedtext');
  var balloon = $('#balloon');

  balloon.css('bottom', $(window).height()-subtitle.offset().top + 30);
}

function showBalloon(){
  $('#balloon').css('display', 'block');
}


$(document).ready(function(){
  positionBaloon();
})




$(document).on('click', function(e){
  console.log(e);
  var balloon = $('#balloon');

  if (balloon.css('display') !== 'none') {
    balloon.css({
      'display': 'none'
    });
  }
});

//Cancelling the effect of event above for .definition children
$(document).on('click', '.definition, .definition *', function(e) {
  e.stopPropagation();
});

