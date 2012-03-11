// Count number of characters when typing in either tweet or hashtag field
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
  setTimeout(charCount, 25); // Delay charCount() until Twitter Bootstrap's Typeahead runs
});

// Unobtrusive form, not necessary, but it makes server-side validation nice (error feedback without page refresh)
function passingAloneParameters() {
  var parameters = '?q=' + params()['q'] + '&page=' + params()['page']
  parameters = parameters.replace(/q=undefined&/, '');
  parameters = parameters.replace(/page=undefined/, '');
  return parameters;
}
$('#content').delegate('#new-tweet-form', 'ajax:success', function(event, data, status, xhr) {
  var url = (params()['origin'] === 'show') ? '/tweets/' + data : '/';
  $.pjax({
    url: url + passingAloneParameters(),
    container: '#content'
  });
});
$('#content').delegate('#new-tweet-form', 'ajax:error', function(event, data, status, xhr) {
  alert(data.responseText);
});
$('#content').delegate('#edit-tweet-form', 'ajax:success', function(event, data, status, xhr) {
  var url = (params()['origin'] === 'show') ? $(this).attr('action') : '/';
  $.pjax({
    url: url + passingAloneParameters(),
    container: '#content'
  });
});
$('#content').delegate('#edit-tweet-form', 'ajax:error', function(event, data, status, xhr) {
  alert(data.responseText);
});

// Get quote from twitter for when adding new tweet
// This is called not only here but also on page load in new.html.haml for when page is not loaded via pjax
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

// Hash tag clear button displayed on edit page
$('#content').delegate('#clear-hash-tag-btn', 'click', function() {
  $('#hash-tag-field').val('');
});