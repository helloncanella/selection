/*global speechSynthesis, SpeechSynthesisUtterance, $, document, window, hide, hideDefinitionTab, showAllTabs, showBalloon*/
/*jshint -W109, -W003, -W098*/
'use strict';
var from = 'en';
var to = 'pt-BR';
var soundIcon = "<div class='sound'><i class=\'fa fa-play-circle\'></i></div>";
var selection = '';

$(document).on('click', '.sound', function() {
  var language = $(this).data('language');
  var expression = $(this).data('expression');
  voice(language, expression);
});

$(document).on('mouseup', '.definition, .definition *', function() {
  var selection = window.getSelection().toString();
  if (selection) {
    printResult(selection);
  }
})

function printResult(selectioned, position) {
  
  selection = selectioned;

  var translate = new Promise(printTranslation);
  var define = new Promise(printDefinitions);
  var getImages = new Promise(searchImage);
  
  Promise.all([translate, define, getImages]).then(function(values) { 
    showAllTabs();
    setWordHeader();
    showBalloon();
  });

}


function setWordHeader() {
  $('.head .sound').remove();

  var language = from;

  $('.head h3.word').text(selection.toLowerCase());
  $('.head').append(soundIcon);
  $('.head .sound').attr({
    'data-language': language,
    'data-expression': selection
  });
}

function printDefinitions(resolve, reject) {
  var url = 'http://api.wordnik.com/v4/word.json/' + selection + '/definitions?limit=6&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
  var language = from;

  getJSON(url).then(function(data) {
    $('#Definition .body').html('');

    if (data.length === 0) {
      hideDefinitionTab();
    }
    else {

      $('#Definition .body').append('<ul></ul>');
      $('#Definition .footer a').attr('href', 'http://www.wordnik.com/words/' + selection);

      var dictionary = data[0].attributionText;
      $('#Definition .footer #dictionary').text(dictionary);

      var results = data;

      results.forEach(function(result, i) {

        var posAbbr = getPoSAbbr(result.partOfSpeech)  // get part-of-speech abbreviation

        var text = filter(result.text);

        var area = text.area;
        var definition = text.definition;
        var example = text.example;

        $('#Definition .body ul').append("<li class='item-" + i + " expression'>" + "<span class=\'part-of-speech\'>" + posAbbr + '</span><span class=\'definition\'> <em class=\'area\'>' + area + ' </em>' + definition + "<em class='example'> " + example + "</em></span></li>");
      });
    }

    function getPoSAbbr(partOfSpeech) {
      
      var abbr;
      
      if (/noun/i.test(partOfSpeech)) {
        abbr = 'n';
      }
      else if (/pronoun/i.test(partOfSpeech)) {
        abbr = 'pron';
      }
      else if (/adjective/i.test(partOfSpeech)) {
        abbr = 'adj';
      }
      else if (/phrasal-verb/i.test(partOfSpeech)) {
        abbr = 'phrasal-verb';
      }
      else if (/verb/i.test(partOfSpeech)) {
        abbr = 'v';
      }
      else if (/adverb/i.test(partOfSpeech)) {
        abbr = 'adv';
      }
      else if (/preposition/i.test(partOfSpeech)) {
        abbr = 'prep';
      }
      else if (/conjunction/i.test(partOfSpeech)) {
        abbr = 'conj';
      }
      else if (/interjection/i.test(partOfSpeech)) {
        abbr = 'interj';
      }
      else if (/article/i.test(partOfSpeech)) {
        abbr = 'art';
      }
      else if (/idiom/i.test(partOfSpeech)) {
        abbr = 'idiom';
      }
      else if (/abbreviation/i.test(partOfSpeech)) {
        abbr = 'abbr';
      }
      else {
        abbr = '';
      }

      return abbr + '.';
    }

    function filter(text) {

      var definitionRegex;

      var area = text.match(/(\w+)(?=\s{2,})/);
      var example = text.match(/\:\s+(.+\b\.?)\s?\)?/);


      if (example) {
        definitionRegex = /\w+[;,.]?\s{1}\b.+\:/
      }
      else {
        definitionRegex = /\w+[;,.]?\s{1}\b.+\:?/
      }

      console.log(text, text.match(definitionRegex));


      return {
        area: area ? area[0] : '',
        definition: text.match(definitionRegex)[0],
        example: example ? example[1] : ''
      }
    }

  
    resolve();
  });


}

function printTranslation(resolve, reject) {
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
        $('#Translation .body ol').append("<li class='item-" + i + " expression'>" + soundIcon + "<p>" + term + "</p></li>");

        $('#Translation .body ol .item-' + i + ' .sound').attr({
          'data-language': language,
          'data-expression': term
        });
      });
    }
    else if (translation) {
      $('#Translation .body').append("<div class='expression'>" + soundIcon + "<p>" + translation + "</p></div>");

      $('#Translation .body .sound').attr({
        'data-language': language,
        'data-expression': translation
      });
    }
    else {
      $('#Translation .body').append(selection);
    }
    
    resolve();
  
    
  })
}

function searchImage(resolve, reject) {
  var url = 'https://duckduckgo.com/?q=' + selection + '&iax=1&ia=images';
  $('#Image .wrapper iframe').attr('src', url);
  resolve();
}


// function search(selection){
//   var url = 'https://duckduckgo.com;
//   $('#Search .wrapper iframe').attr('src', url);
// }

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
