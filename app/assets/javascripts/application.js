// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require jquery.pjax
//= require swipesense
//= require swipe
//= require_tree .

// pjax binding
$('a[data-pjax]').pjax();

// cancel button binding
$('#content').delegate('.cancel', 'click', function() {
  history.back();
});

// gallery binding
function gallerySetup() {
  var slides = document.getElementById('slider').getElementsByTagName('li');
  var bullets = document.getElementById('sequence').getElementsByTagName('li');
  window.mySwipe = new Swipe(
    document.getElementById('slider'),
    {
      startSlide: parseInt($('#start-index').val()),
      callback: function(e, pos) {
        // Update bullets
        var i = bullets.length;
        while (i--) {
          bullets[i].className = '';
        }
        bullets[pos].className = 'active';
        // Update form actions
        var id = slides[pos].id;
        document.getElementById('reply').href = '/tweets/' + id + '/reply'
        document.getElementById('edit').href = '/tweets/' + id + '/edit'
        document.getElementById('delete').href = '/tweets/' + id
      }
    }
  );
}
$('body').delegate('#content', 'pjax:success', function(e, xhr, err) {
  if ($('#gallery').length > 0) {
    gallerySetup();
  }
});

// Url bar hiding
(function() {
  var win = window,
      doc = win.document;
  // If there's a hash, or addEventListener is undefined, stop here
  if ( !location.hash || !win.addEventListener ) {
    //scroll to 1
    window.scrollTo( 0, 1 );
    var scrollTop = 1,
    //reset to 0 on bodyready, if needed
    bodycheck = setInterval(function(){
      if( doc.body ){
        clearInterval( bodycheck );
        scrollTop = "scrollTop" in doc.body ? doc.body.scrollTop : 1;
        win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
      } 
    }, 15 );
    if (win.addEventListener) {
      win.addEventListener("load", function(){
        setTimeout(function(){
          //reset to hide addr bar at onload
          win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
        }, 0);
      }, false );
    }
  }
})();