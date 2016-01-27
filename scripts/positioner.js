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


$(document).on('click', 'body *:not(#balloon, #balloon *)', function(e) {
  console.log(e);

  var balloon = $('#balloon');

  if (balloon.css('display') !== 'none') {
    balloon.css({
      // 'display': 'none'
    });
  }
});