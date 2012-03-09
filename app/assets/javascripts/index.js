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
// params: { data: [html], direction: 'forward' | 'backword' }
// $.fn.slideIn = function(options) {
//   var el = this;
//   var forward = options.direction === 'forward';
//   var width = el.width();
//   var transfer = $('<div></div>').width(2 * width).css({ marginLeft: forward ? 0 : -width });
//   var current = $('<div></div>').width(width).css({ left: 0, float: 'left' }).html(el.html());
//   var next = $('<div></div>').width(width).css({ left: width, float: 'left' }).html(options.data);
//   forward ? transfer.append(current, next) : transfer.append(next, current);
//   el.html(transfer);
//   transfer.animate({ marginLeft: forward ? -width : 0 }, 250, function () {
//     el.html(options.data);
//   });
// }
var toPaginate = false;
function paginate() {
  if (toPaginate) {
    toPaginate = false;
    clearInterval(paginateId);
    // slideIn is too expensive to render, this is a light weight substitute
    $('#matches').css('opacity', 0.5).html($('#to-paginate').html()).delay(200).fadeTo(0, 1);
  }
}
$('#pagination a').pjax('#to-paginate');
$('body').delegate('#to-paginate', 'pjax:start', function(e, xhr, err) {
  $('body, html').animate({ scrollTop: 0 }, 350, function() {
    toPaginate = true;
  });
});
$('body').delegate('#to-paginate', 'pjax:complete', function(e, xhr, err) {
  paginateId = setInterval(paginate, 50);
});