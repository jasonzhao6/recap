// Ajax search
function search() {
  var $matches = $('#matches');
  $matches.html('');
  var query = escape($('#search').val());
  $.get('/?ajax=true&q=' + query, function(data) {
    $matches.html(data);
  });
}
$('#content').delegate('#search', 'keyup', function() {
  var $clearSearch = $('#clear-search');
  $(this).val().length > 0 ? $clearSearch.show() : $clearSearch.hide()
  search();
});
$('#content').delegate('#clear-search', 'click', function() {
  $('#search').val('');
  $('#clear-search').hide();
  search();
});
$('#content').delegate('.form-search', 'submit', function(e) {
  e.preventDefault();
});