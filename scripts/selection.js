/*global $, window, printResult, setWordHeader,printTranslation,searchImage, printDefinitions, showAllTabs*/
/*jshint -W003*/
'use strict';

var startPoint, endPoint, isMouseDown = false,
  start, end;

$('.player-timedtext').mouseenter(function() {
  var children = $(this).children();
  var counter = 0;
  children.each(function() {
    var spanChild = $(this).children('span');
    var newText = replace(spanChild.text());

    spanChild.html(newText);
  });

  $(this).off('mouseenter');
  activeEvents();

  function replace(text) {
    var regex = /((?:\b(=?[,\.\?]?\s+|\w+)\b)|[\?\.\,])/g;
    var newText = text.replace(regex, function(match) {
      counter++;
      return '<span class=\'match\' id=\'item-' + counter + '\' data-offset=\'' + counter + '\'>' + match + '</span>';
    });
    return newText;
  }

  function activeEvents() {


    $('.match').on({
      mousedown: function() {
        isMouseDown = true;
        startPoint = $(this).data('offset');
      },
      mouseenter: function() {
        if (isMouseDown) {
          endPoint = $(this).data('offset');
        }

        start = startPoint ? startPoint : $(this).data('offset');
        end = endPoint ? endPoint : start;

        if ((end - start) < 0) {
          var changed = changePosition(start, end);
          start = changed.start;
          end = changed.end;
        }

        color(start, end);

      },
      mouseleave: function() {
        if (!isMouseDown) {
          discolorAll();
        }
      },

      mouseup: function(e) {
        
        var position = {
          x: e.clientX,
          y: e.clientY
        }
        
        restartVariables();
        discolorAll();

        var text = getText(start, end);

        if (text) {
          showAllTabs();
          printResult(text, position);
        }
      }
    });


  }

  function getText(start, end) {
    var text = '';
    for (var i = start; i <= end; i++) {
      text += $('#item-' + i).text();
    }
    return text;
  }

  function restartVariables() {
    startPoint = endPoint = null;
    isMouseDown = false;
  }

  function color(start, end) {
    discolorAll();

    for (var i = start; i <= end; i++) {
      $('#item-' + i).css({
        'background': 'blue',
        'color': 'white'
      });
    }

  }

  function discolorAll() {
    $('.player-timedtext span').css({
      'background': 'none',
      'color': 'yellow'
    });
  }

  function changePosition(start, end) {
    var copy = start;

    start = end;
    end = copy;

    return {
      'start': start,
      'end': end
    };
  }
});
