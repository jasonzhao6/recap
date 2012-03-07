// charCount() binding
function charCount() {
  var length = $('#tweet-field').val().length + $('#hash-tag-field').val().length + 2;
  var $charCount = $('#char-count');
  $charCount.text(length);
  if (length <= 140) {
    $charCount.css('color', 'black');
  } else {
    $charCount.css('color', 'red');
  }
}
$('#content').delegate('#tweet-field', 'keyup', function() {
  charCount();
});
$('#content').delegate('#hash-tag-field', 'blur', function() {
  var $hashTagField = $('#hash-tag-field');
  $hashTagField.val($hashTagField.val().replace(/ /g, '').toLowerCase());
});

// Unobtrusive form, not necessary, but it makes server-side validation nice (error feedback without page refresh)
$('#content').delegate('#new-tweet-form', 'ajax:success', function(event, data, status, xhr) {
  $('#home-button').click();
});
$('#content').delegate('#new-tweet-form', 'ajax:error', function(event, data, status, xhr) {
  charCount();
  alert(data.responseText);
});
$('#content').delegate('#edit-tweet-form', 'ajax:success', function(event, data, status, xhr) {
  $.pjax({
    url: $(this).attr('action'),
    container: '#content'
  });
});
$('#content').delegate('#edit-tweet-form', 'ajax:error', function(event, data, status, xhr) {
  charCount();
  alert(data.responseText);
});

// getQuote() binding, not only here but also on page load when not loaded via pjax (see page source)
function getQuote() {
  $.get('/quote', function(data) {
    $('#quote').html(data);
  });
}
$('body').delegate('#content', 'pjax:end', function(event, data, status, xhr) {
  if (data.responseText.indexOf("<p id='quote'></p>") != -1) {
    getQuote();
  }
});

// Clear hash-tag
$('#content').delegate('#clear-hash-tag-btn', 'click', function() {
  $('#hash-tag-field').val('');
});