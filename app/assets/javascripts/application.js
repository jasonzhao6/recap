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

$('#clear-search').click(function() {
  $('.search-query').val('');
});

$('.search-query').keyup(function() {
  var query = escape($('.search-query').val());
  $.get('/?ajax=true&q=' + query, function(data) {
    $('#matches').html(data);
  });
  // $.pjax({
  //   url: '/?q=' + query,
  //   container: '#main'
  // })
});