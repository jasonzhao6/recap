// Clear hash-tag
$('#content').delegate('#clear-hash-tag', 'click', function() {
  $('#hash-tag').val('');
});

// jQuery-ujs post # this is not necessary, but it makes server-side validation nice (error feedback without page refresh)
$('#content').delegate('#edit_tweet', 'ajax:success', function(event, data, status, xhr) {
  $.pjax({
    url: $(this).attr('action'),
    container: '#content'
  });
});
$('#content').delegate('#edit_tweet', 'ajax:error', function(event, data, status, xhr) {
  alert(data.responseText);
});
