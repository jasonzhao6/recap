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

// Pjax pagination binding
$.fn.slideTo = function(data) {
  var el = this;
  var width = el.width();
  var transfer = $('<div></div>').width(2 * width);
  var current = $('<div></div>').width(width).css({ left: 0, float: 'left' }).html(el.html());
  var next = $('<div></div>').width(width).css({ left: width, float: 'left' }).html(data);
  transfer.append(current, next);
  el.html(transfer);
  transfer.animate({ marginLeft: -width }, 250, function () {
    el.html(data);
  });
}
var paginated = false;
function paginate() {
  if (paginated) {
    paginated = false;
    clearInterval(paginateId);
    $('#content').slideTo($('#paginated').html());
  }
}
$('#pagination a').pjax('#paginated');
$('body').delegate('#paginated', 'pjax:start', function(e, xhr, err) {
  $('body, html').animate({ scrollTop: 0 }, 350, function() {
    setTimeout('paginated = true;', 100);
  });
});
$('body').delegate('#paginated', 'pjax:end', function(e, xhr, err) {
  paginateId = setInterval(paginate, 100);
});