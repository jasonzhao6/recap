// Ajax search
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