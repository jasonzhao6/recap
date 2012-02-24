// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require jquery.pjax
//= require_tree .

// Search
function search() {
  var query = escape($('#search').val());
  $.get('/?ajax=true&q=' + query, function(data) {
    $('#matches').html(data);
  });
}
$('#content').delegate('#search', 'keyup', function() {
  search();
});
$('#content').delegate('#clear-search', 'click', function() {
  $('#search').val('');
  search();
});

// Pjax binding
$('a[data-pjax]').pjax();

// Char count
$('#content').delegate('#tweet, #hash-tag', 'keyup', function() {
  $hashTag = $('#hash-tag');
  $hashTag.val($hashTag.val().replace(/ /, '').toLowerCase());
  var length = $('#tweet').val().length + $hashTag.val().length + 1;
  var $charCount = $('#char-count');
  $charCount.text(length);
  if (length <= 140) {
    $charCount.css('color', 'black');
  } else {
    $charCount.css('color', 'red');
  }
});