// Clear hash-tag
$('#content').delegate('#clear-hash-tag-btn', 'click', function() {
  $('#hash-tag-field').val('');
  $('#hash-tag-field').blur();
});

// Unobtrusive form, not necessary, but it makes server-side validation nice (error feedback without page refresh)
$('#content').delegate('#edit-tweet-form', 'ajax:success', function(event, data, status, xhr) {
  $.pjax({
    url: $(this).attr('action'),
    container: '#content'
  });
});
$('#content').delegate('#edit-tweet-form', 'ajax:error', function(event, data, status, xhr) {
  alert(data.responseText);
});
