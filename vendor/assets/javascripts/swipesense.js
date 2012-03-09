// TOUCH-EVENTS SINGLE-FINGER SWIPE-SENSING JAVASCRIPT
// Courtesy of PADILICIOUS.COM and MACOSXAUTOMATION.COM

// this script can be used with one or more page elements to perform actions based on them being swiped with a single finger

var triggerElementID = null; // this variable is used to identity the triggering element
var fingerCount = 0;
var startX = 0;
var startY = 0;
var curX = 0;
var curY = 0;
var deltaX = 0;
var deltaY = 0;
var minLength = 25; // the shortest distance the user may swipe
var swipeLength = 0;
var swipeAngle = null;
var swipeDirection = null;
var isScrollingHorizontally = null;

// The 4 Touch Event Handlers

// NOTE: the touchStart handler should also receive the ID of the triggering element
// make sure its ID is passed in the event call placed in the element declaration, like:
// <div id="picture-frame" ontouchstart="touchStart(event,'picture-frame');"  ontouchend="touchEnd(event);" ontouchmove="touchMove(event);" ontouchcancel="touchCancel(event);">

function touchStart(event, passedName) {
  // disable the standard ability to select the touched object
  // get the total number of fingers touching the screen
  fingerCount = event.touches.length;
  // since we're looking for a swipe (single finger) and not a gesture (multiple fingers),
  // check that only one finger was used
  if ( fingerCount == 1 ) {
    // get the coordinates of the touch
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
    // store the triggering element ID
    triggerElementID = passedName;
  } else {
    // more than one finger touched so cancel
    touchCancel(event);
  }
}

function touchMove(event) {
  // if triggerElementID were null, then swiped-container has already been displayed
  if (triggerElementID) {
    curX = event.touches[0].pageX;
    curY = event.touches[0].pageY;
    deltaX = curX - startX;
    deltaY = curY - startY;
    if (isScrollingHorizontally === null) { // check once
      isScrollingHorizontally = !!( Math.abs(deltaX) > Math.abs(deltaY) );
    }
    if (isScrollingHorizontally) { // prevent vertical scrolling
      event.preventDefault();
      swipeLength = Math.round(Math.sqrt(Math.pow(curX - startX,2) + Math.pow(curY - startY,2)));
      if ( swipeLength >= minLength ) {
        caluculateAngle();
        determineSwipeDirection();
        processingRoutine();
        touchCancel(event);
      }
    }
  }
}

function touchEnd(event) {
  touchCancel(event)
}

function touchCancel(event) {
  // reset the variables back to default values
  triggerElementID = null;
  fingerCount = 0;
  startX = 0;
  startY = 0;
  curX = 0;
  curY = 0;
  deltaX = 0;
  deltaY = 0;
  swipeLength = 0;
  swipeAngle = null;
  swipeDirection = null;
  isScrollingHorizontally = null;
}

function caluculateAngle() {
  var X = startX-curX;
  var Y = curY-startY;
  var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
  var r = Math.atan2(Y,X); //angle in radians (Cartesian system)
  swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
  if ( swipeAngle < 0 ) { swipeAngle =  360 - Math.abs(swipeAngle); }
}

function determineSwipeDirection() {
  if ( (swipeAngle <= 45) && (swipeAngle >= 0) ) {
    swipeDirection = 'left';
  } else if ( (swipeAngle <= 360) && (swipeAngle >= 315) ) {
    swipeDirection = 'left';
  } else if ( (swipeAngle >= 135) && (swipeAngle <= 225) ) {
    swipeDirection = 'right';
  } else if ( (swipeAngle > 45) && (swipeAngle < 135) ) {
    swipeDirection = 'down';
  } else {
    swipeDirection = 'up';
  }
}

function processingRoutine() {
  var alreadyActive = $('#' + triggerElementID + '').hasClass('active');
  if ( swipeDirection == 'left' || swipeDirection == 'right' ) {
    $('.swiped-container').removeClass('active');
    if (!alreadyActive) {
      // fadeIn is too expensive to render, this is a light weight substitute
      $('#' + triggerElementID + '').css('opacity', .9).addClass('active').delay(100).fadeTo(0, 1);
    }
  }
}