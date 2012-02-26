// Char count
$('#content').delegate('#tweet, #hash-tag', 'keyup', function() {
  $hashTag = $('#hash-tag');
  $hashTag.val($hashTag.val().replace(/ /, '').toLowerCase());
  var length = $('#tweet').val().length + $hashTag.val().length + 1;
  var $charCount = $('#char-count');
  $charCount.text(length);
  if (length <= 140) {
    $charCount.css('color', 'black');
  } else {
    $charCount.css('color', 'red');
  }
});

// jQuery-ujs post
$('#content').delegate('#new_tweet', 'ajax:success', function(event, data, status, xhr) {
  $('#home').click();
});
$('#content').delegate('#new_tweet', 'ajax:error', function(event, data, status, xhr) {
  alert(data.responseText);
});