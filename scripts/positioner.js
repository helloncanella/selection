function positionBaloon(position) {
  $('#balloon').css({
    'top': position.y - $('#balloon').height() - 70,
    'left': position.x - $('#balloon').width() / 2,
    'display': 'block'
  });
}


$(document).on('click', 'body *:not(#balloon, #balloon *)', function(e) {
  console.log(e);

  var balloon = $('#balloon');

  if (balloon.css('display') !== 'none') {
    balloon.css({
      'display': 'none'
    });
  }
});