/*global speechSynthesis, SpeechSynthesisUtterance, $, document, window*/
/*jshint -W109, -W003, -W098*/
'use strict';
var from = 'en';
var to = 'pt-BR';
var soundIcon = "<div class='sound'></div>";

$(document).on('click', '.sound', function() {
  var language = $(this).data('language');
  var expression = $(this).data('expression');
  voice(language, expression);
});

function printWord(selection) {
  var language = from;

  $('#Word .wrapper').html('').append("<div class='expression'>" +
    "<p>" + selection + "</p>" + soundIcon + '</p>' + "</div>");

  $('#Word .wrapper .sound').attr({'data-language': language, 'data-expression': selection});
}

function printTranslation(selection) {
  var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&hl=' + from + '&tl=' + to + '&dt=t&dt=bd&dj=1&source=input&tk=402644.402644&q=' + selection + '';
  var language = to;

  getJSON(url).then(function(data) {
    var terms;
    var translation = data.sentences[0].trans;

    $('#Translation .wrapper').html('');

    if (data.dict) {
      terms = data.dict[0].terms;
      $('#Translation .wrapper').append('<ol></ol>');
    }

    if (terms && terms.length > 0) {terms.forEach(function(term, i) {
        $('#Translation .wrapper ol').append("<li class='item-" + i + " expression'>" + "<p>" + (i + 1) + '. ' + term + "</p>" + soundIcon + "</li>");

        $('#Translation .wrapper ol .item-' + i + ' .sound').attr({'data-language': language, 'data-expression': term});
      });} else if (translation) {$('#Translation .wrapper').append("<div class='expression'>" +
        "<p>" + translation + "</p>" + soundIcon + "</div>");

      $('#Translation .wrapper .sound').attr({'data-language': language, 'data-expression': translation});} else {$('#Translation .wrapper').append(selection);}

  });
}

function searchImage(selection) {
  var url = 'https://duckduckgo.com/?q=' + selection + '&iax=1&ia=images';
  $('.wrapper iframe').attr('src', url);
}

function getJSON(url) {

  return new Promise(function(resolve, reject) {
    $.jsonp({
      url: url, corsSupport: true, // if URL above supports CORS (optional)
      jsonpSupport: true, // if URL above supports JSONP (optional)

      success: function(data) {
        resolve(data);
      },
      error: function(error) {
        reject(error);
      }
      // error, etc.
    });
  });

}

function voice(language, text) {
  speechSynthesis.cancel(); // destroying past queue
  var voices = window.speechSynthesis.getVoices();
  var msg = new SpeechSynthesisUtterance();

  msg.voiceURI = 'native';
  msg.volume = 1; // 0 to 1
  msg.rate = 1; // 0.1 to 10
  msg.pitch = 1; //0 to 2

  for (var i = 0; i < voices.length; i++) {
    if (language === voices[i].lang) {
      msg.voice = voices[i];
    }
  }

  msg.text = String(text);
  msg.lang = String(language);
  speechSynthesis.speak(msg);

}
