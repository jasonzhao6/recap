// Char count
function count() {
  var length = $('#tweet').val().length + $('#hash-tag').val().length + 2;
  var $charCount = $('#char-count');
  $charCount.text(length);
  if (length <= 140) {
    $charCount.css('color', 'black');
  } else {
    $charCount.css('color', 'red');
  }
}
$('#content').delegate('#tweet', 'keyup', function() {
  count();
});
$('#content').delegate('#hash-tag', 'blur', function() {
  var $hashTag = $('#hash-tag');
  $hashTag.val($hashTag.val().replace(/ /g, '').toLowerCase());
  count();
});

// jQuery-ujs post # this is not necessary, but it makes server-side validation nice (error feedback without page refresh)
$('#content').delegate('#new_tweet', 'ajax:success', function(event, data, status, xhr) {
  $('#home').click();
});
$('#content').delegate('#new_tweet', 'ajax:error', function(event, data, status, xhr) {
  alert(data.responseText);
});

// Ajax getQuote
function getQuote() {
  $.get('/quote', function(data) {
    $('#quote').html(data);
  });
}
$('#content').on('pjax:end', function(event, data, status, xhr) {
  if (data.responseText.indexOf("<p id='quote'></p>") != -1) {
    getQuote();
  }
});