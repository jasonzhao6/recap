// Ajax search
function search() {
  var query = escape($('#search').val());
  $.get('/?ajax=true&q=' + query, function(data) {
    $('#matches').html(data);
  });
}
$('#content').delegate('#search', 'keyup', function() {
  search();
  $('#clear-search').show();
});
$('#content').delegate('#clear-search', 'click', function() {
  $('#clear-search').hide();
  $('#search').val('');
  search();
});
$('#content').delegate('.form-search', 'submit', function(e) {
  e.preventDefault();
});