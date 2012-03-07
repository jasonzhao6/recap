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

// pjax() binding
$('a[data-pjax], #pagination a').pjax('#content');
$('body').delegate('#content', 'pjax:start', function(e, xhr, err) {
  $('body, html').animate({
		scrollTop: 0
	}, 350);
});

// gallerySetup() binding, not only here but also on page load when not loaded via pjax (see page source)
function gallerySetup() {
  var slides = $('#slider li');
  var bullets = $('#position li');
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
        $('.reply-btn').attr('href', '/tweets/' + id + '/reply')
        $('.edit-btn').attr('href', '/tweets/' + id + '/edit')
        $('.delete-btn').attr('href', '/tweets/' + id)
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