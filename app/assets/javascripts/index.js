// Ajax search
function search() {
  var $matches = $('#matches');
  $matches.html('');
  var query = escape($('#search-field').val());
  $.get('/?ajax=true&q=' + query, function(data) {
    $matches.html(data);
  });
}
$('#content').delegate('#search-field', 'keyup', function() {
  var $clearSearch = $('#clear-search-btn');
  $(this).val().length > 0 ? $clearSearch.show() : $clearSearch.hide()
  search();
});
$('#content').delegate('#clear-search-btn', 'click', function() {
  $('#search-field').val('');
  $('#clear-search-btn').hide();
  search();
});
$('#content').delegate('.form-search', 'submit', function(e) {
  e.preventDefault();
});