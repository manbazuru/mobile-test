$(function() {

// タッチイベントに対応しているかを判定
var isTouch = 'ontouchend' in document;

// js-test
var x,y,original;
var $hitarea = $('.js-test-hitarea');

if(isTouch) {
  $hitarea.on({
    'touchstart' : touchStart,
    'touchmove' : touchMove,
    'touchend' : touchEnd
  });
}

function touchStart(e) {
  original = e.originalEvent;

  x = original.changedTouches[0].pageX;
  y = original.changedTouches[0].pageY;

  $('.startx').text('startX : ' + x);
  $('.starty').text('startY : ' + y);
}

function touchMove(e){
  e.preventDefault();
  original = e.originalEvent;

  x = original.changedTouches[0].pageX;
  y = original.changedTouches[0].pageY;

  $('.movex').text('moveX : ' + x);
  $('.movey').text('moveY : ' + y);
}

function touchEnd() {
  $('.endx').text('endX : ' + x);
  $('.endy').text('endY : ' + y);
}



// js-carr
var $carrWrap = $('.js-carr-wrap');
var $carrContents = $('.js-carr-contents');

var posArr = [];
var posX,posY,moveX,moveY;
var move = 0;
var paddingLeft = $carrContents.css('padding-left').split('px');
var paddingRight = $carrContents.css('padding-right').split('px');
var judge = ($carrContents.width() + parseInt(paddingLeft[0],10) + parseInt(paddingRight[0],10)) / 3;


var init = function() {
  if(isTouch) {
    $carrContents.on({
      'touchstart' : function(e) {Func.carrStart(e)},
      'touchmove' : function(e) {Func.carrMove(e)},
      'touchend' : function() {Func.carrEnd()}
    });
  }

  $('.icon-left').on('click',function(){
    Func.goLeft();
  });
  $('.icon-right').on('click',function(){
    Func.goRight();
  });
};


var Func = {
  carrStart : function(e) {
    original = e.originalEvent;

    posX = original.changedTouches[0].pageX;
    posY = original.changedTouches[0].pageY;

    posArr.splice(0,posArr.length,posX,posY);
  },

  carrMove : function(e) {
    original = e.originalEvent;
    posX = original.changedTouches[0].pageX;
    posY = original.changedTouches[0].pageY;
    moveX = posArr[0] - posX;
    moveY = posArr[1] - posY;

    if(moveX > 20 || moveX < -20 || moveY > 18 || moveY < -18) {
      e.preventDefault();
    }

    var calcPercent = Func.calcPercent(moveX,'.js-carr-contents');
    $carrWrap.css({'margin-left': move + -calcPercent + '%'});
  },

  carrEnd : function() {
    if(moveX < judge && moveX > -judge) {
      $carrWrap.animate({'margin-left': move + '%'},300,'linear');
    }else{
      if(moveX > judge) {
        Func.goRight();
      }else if(moveX < -judge) {
        Func.goLeft();
      }
    }
  },

  goLeft : function() {
    move += 100;
    if(move > 0) {
      move = ($carrContents.length - 1) * -100;
    }

    $carrWrap.stop().animate({'margin-left': move + '%'},300,'linear');
  },

  goRight : function() {
    move -= 100;
    if(move < ($carrContents.length - 1) * -100) {
      move = 0;
    }

    $carrWrap.stop().animate({'margin-left': move + '%'},300,'linear');
  },

  calcPercent : function(value,elm) {
    var pl = $(elm).css('padding-left').split('px');
    var pr = $(elm).css('padding-right').split('px');
    var total = ($(elm).width() + parseInt(pl[0],10) + parseInt(pr[0],10));
    value = value / (total / 100);
    return value;
  }
};

init();
});


