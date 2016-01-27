$('.player-timedtext').click(function(e) {
  e.stopPropagation();

});

function positionBaloon(position) {
  $('#balloon').css({
    'top': position.y - $('#balloon').height() - 70,
    'left': position.x - $('#balloon').width() / 2,
    'display': 'block'
  });
}


$('html:not(#balloon *)').click(function(e) {
  var balloon = $('#balloon');

  if (balloon.css('display') !== 'none') {
    balloon.css({
      'display': 'none'
    });
  }
});