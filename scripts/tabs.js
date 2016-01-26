/*global $*/
'use strict';

function hideDefinitionTab() {
  $('.definition-tab').hide();
  $('#tabs li').attr('id', '');
  $('.translation-tab a').trigger('click');
}

function showAllTabs() {
  $('#tabs li').fadeIn();
  $('#content>div').hide(); // Initially hide all content
  $('#tabs li:first').attr('id', 'current'); // Activate first tab
  $('#content div:first').fadeIn(); // Show first tab content
}

showAllTabs();


$(document).on('click', '#tabs a', function(e) {
  e.preventDefault();
  $('#content>div').hide(); //Hide all content
  $('#tabs li').attr('id', ''); //Reset id's
  $(this).parent().attr('id', 'current'); // Activate this
  $('#' + $(this).attr('title')).fadeIn(); // Show content for current tab
});
