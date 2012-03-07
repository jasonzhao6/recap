// Ajax search
function search() {
  var query = escape($('#search-field').val());
  if (query != '%23') {
    $.get('/search?q=' + query, function(data) {
      $('#matches').html(data);
    });
  }
}
$('#content').delegate('#search-field', 'keyup', function() {
  var $clearSearch = $('#clear-search-btn');
  $(this).val().length > 0 ? $clearSearch.show() : $clearSearch.hide()
  if (typeof(searchId) === 'number') {
    clearTimeout(searchId);
    searchId = null;
  }
  searchId = setTimeout(search, 200);
});
$('#content').delegate('#clear-search-btn', 'click', function() {
  $('#search-field').val('');
  $('#clear-search-btn').hide();
  search();
});
$('#content').delegate('.form-search', 'submit', function(e) {
  e.preventDefault();
});