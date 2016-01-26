/*global speechSynthesis, SpeechSynthesisUtterance, $, document, window, hide*/
/*jshint -W109, -W003, -W098*/
'use strict';
var from = 'en';
var to = 'pt-BR';
var soundIcon = "<div class='sound'><i class=\'fa fa-play-circle\'></i></div>";

$(document).on('click', '.sound', function() {
  var language = $(this).data('language');
  var expression = $(this).data('expression');
  voice(language, expression);
});

$(document).on('mouseup', '.definition',function(){
  var selection = window.getSelection().toString();
  if(selection){
    printResult(selection);
  }
})

function printResult(selection){
  setWordHeader(selection);
  printTranslation(selection);
  searchImage(selection);
  printDefinitions(selection);
}


function setWordHeader(selection){
  $('.head .sound').remove();
  
  var language = from;
  
  $('.head h3.word').text(selection.toLowerCase());
  $('.head').append(soundIcon);
  $('.head .sound').attr({
    'data-language': language,
    'data-expression': selection
  });
}

function printDefinitions(selection) {
  var url = 'http://api.wordnik.com/v4/word.json/' + selection + '/definitions?limit=6&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
  var language = from;

  getJSON(url).then(function(data) {
    $('#Definition .body').html('');
    
    if (data.length === 0) {
      // hide($('.definition-tab'));
    }
    else {
      
      $('#Definition .body').append('<ul></ul>');
      $('#Definition .footer a').attr('href','http://www.wordnik.com/words/'+selection);
      
      var dictionary = data[0].attributionText;
      $('#Definition .footer #dictionary').text(dictionary);

      var definitions = data;
     
      definitions.forEach(function(definition, i) {
        var partOfSpeech = definition.partOfSpeech;
        var text = definition.text;

        $('#Definition .body ul').append("<li class='item-" + i + " expression'>" + "<div class=\'part-of-speech\'>" + partOfSpeech + '. </div><div class=\'definition\'>' + text + "</div></li>");
      });
    }

  })


}

function printTranslation(selection) {
  var url = 'http://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&hl=' + from + '&tl=' + to + '&dt=t&dt=bd&dj=1&source=input&tk=402644.402644&q=' + selection + '';
  var language = to;

  getJSON(url).then(function(data) {


    var terms;
    var translation = data.sentences[0].trans;

    $('#Translation .body').html('');

    if (data.dict) {
      terms = data.dict[0].terms;
      $('#Translation .body').append('<ol></ol>');
    }

    if (terms && terms.length > 0) {
      terms.forEach(function(term, i) {
        $('#Translation .body ol').append("<li class='item-" + i + " expression'>" +soundIcon+ "<p>" + term + "</p></li>");

        $('#Translation .body ol .item-' + i + ' .sound').attr({
          'data-language': language,
          'data-expression': term
        });
      });
    }
    else if (translation) {
      $('#Translation .body').append("<div class='expression'>" +
        "<p>" + translation + "</p>" + soundIcon + "</div>");

      $('#Translation .body .sound').attr({
        'data-language': language,
        'data-expression': translation
      });
    }
    else {
      $('#Translation .body').append(selection);
    }

  })
}

function searchImage(selection) {
  var url = 'https://duckduckgo.com/?q=' + selection + '&iax=1&ia=images';
  $('.wrapper iframe').attr('src', url);
}

function getJSON(url) {

  return new Promise(function(resolve, reject) {
    $.jsonp({
      url: url,
      corsSupport: true, // if URL above supports CORS (optional)
      jsonpSupport: true, // if URL above supports JSONP (optional)

      success: function(data) {
        resolve(data);
      },
      error: function(error) {
          console.warn('ERRO');
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
    
    //console.log(voices[i].lang);
  }

  msg.text = String(text);
  msg.lang = String(language);
  speechSynthesis.speak(msg);

}
