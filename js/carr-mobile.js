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
var $carr = $('.js-carr');
var $carrWrap = $carr.children('.js-carr-wrap');
var $carrContents = $carrWrap.children('.js-carr-contents');
// ページャー生成用のクラスがあるかを判定
var isPager = $carr.children('div').hasClass('js-carr-pager');
var $carrPager,_on;

var posArr = [];
var posX,posY,moveX,moveY,move,count3d,calcPercent;
var paddingLeft = $carrContents.css('padding-left').split('px');
var paddingRight = $carrContents.css('padding-right').split('px');
// フリック時の判定用。全体の幅＋左右パディング / 判定値。3だと1/3になる
var judge = ($carrContents.width() + parseInt(paddingLeft[0],10) + parseInt(paddingRight[0],10)) / 3;


var init = function() {
  move = 0;
  count3d = 100 / $carrContents.length; // translate3dの場合、全体の幅が基準になるので合わす

  // タッチイベントに対応してたら開始
  if(isTouch) {
    $carrContents.on({
      'touchstart' : function(e) {Func.carrStart(e)},
      'touchmove' : function(e) {Func.carrMove(e)},
      'touchend' : function() {Func.carrEnd()}
    });
  }

  // ページャー生成用のクラスがあればページャー生成
  if(isPager) {
    Func.createPager();
  }

  // クリックイベント
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

    // スクロールの可能性を考慮
    if(moveX > 20 || moveX < -20 || moveY > 18 || moveY < -18) {
      e.preventDefault();
    }

    calcPercent = Func.calcPercent(moveX,'.js-carr-wrap');
    $carrWrap.css({'transform' : 'translate3d(' + (move - calcPercent) + '%,0,0)'});
  },

  carrEnd : function() {
    // touchmoveを経由したかを判定。してなければ動かさない
    if(posArr[0] < posX + 20 && posArr[0] > posX - 20) {
      moveX = 0;
    }

    // 変数judge以上動かしたかを判定。動いていなければ元の位置に戻す
    if(moveX < judge && moveX > -judge) {
      $carrWrap.css({'transform': 'translate3d(' + move + '%,0,0)'});
    }else{
      if(moveX > judge) {
        Func.goRight();
      }else if(moveX < -judge) {
        Func.goLeft();
      }
    }
  },

  goLeft : function() {
    move += count3d;
    if(move > 0) {
      move = ($carrContents.length - 1) * -count3d;
    }

    $carrWrap.stop().css({'transform' : 'translate3d(' + move + '%,0,0)'});

    // ページャーがあったらページャーも動作
    if(isPager) {
      Func.pagerMove();
    }
  },

  goRight : function() {
    move -= count3d;
    if(move < ($carrContents.length - 1) * -count3d){
      move = 0;
    }

    $carrWrap.stop().css({'transform': 'translate3d(' + move + '%,0,0)'});

    // ページャーがあったらページャーも動作
    if(isPager) {
      Func.pagerMove();
    }
  },

  calcPercent : function(value,elm) {
    var pl = $(elm).css('padding-left').split('px');
    var pr = $(elm).css('padding-right').split('px');
    var total = ($(elm).width() + parseInt(pl[0],10) + parseInt(pr[0],10));
    value = value / (total / count3d);
    return value;
  },

  createPager : function() {
    $carrPager = $carr.children('.js-carr-pager');

    $carrPager.append('<ul class="js-carr-pager-wrap">');
    for(var i = 0; i< $carrContents.length; i++) {
      $('.js-carr-pager-wrap').append('<li class="js-carr-pager-item">');
    }
    // 初期値として1番目のページャーをオンにする
    $('.js-carr-pager-item').first().addClass('_on');
  },

  pagerMove : function() {
    // translate3dの場合は一度幅を戻す。animateだったらmove / 100のみでOK
    _on = -(move * $carrContents.length / 100);
    $carrPager.find('li')
      .removeClass('_on')
      .eq(_on).addClass('_on');
  }
};

init();
});


