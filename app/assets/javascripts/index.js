// Ajax search
function search() {
  $searchField = $('#search-field');
  var query = $searchField.val();
  if (query.substring(0, 2).toLowerCase() === 'h ') {
    query = query.replace(/^h /i, '#')
    $searchField.val(query);
  }
  if (query != '#') {
    $.ajax({
      url: '/?q=' + escape(query),
      headers: {
        'X-AJAX': true
      },
      success: function(data) {
        $('#matches').html(data);
      }
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