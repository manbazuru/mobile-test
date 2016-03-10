$(function() {
var x,y;

// タッチイベントに対応しているかを判定
var isTouch = 'ontouchend' in document;

// js-test
if(isTouch) {
  $(document).on({
    'touchstart' : touchStart,
    'touchmove' : touchMove,
    'touchend' : touchEnd
  },'.js-test-hitarea');
}

function touchStart(e) {
  var original = e.originalEvent;

  x = original.changedTouches[0].pageX;
  y = original.changedTouches[0].pageY;

  $('.startx').text('startX : ' + x);
  $('.starty').text('startY : ' + y);
};

function touchMove(e){
  var original = e.originalEvent;
  e.preventDefault();

  x = original.changedTouches[0].pageX;
  y = original.changedTouches[0].pageY;

  $('.movex').text('moveX : ' + x);
  $('.movey').text('moveY : ' + y);
}

function touchEnd() {
  $('.endx').text('endX : ' + x);
  $('.endy').text('endY : ' + y);
}
});


// js-carr