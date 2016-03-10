$(function() {
  var $carrContents = $('.js-carr-contents');

  // タッチイベントに対応しているかを判定
  var isTouch = 'touchend' in document;

  $carrContents.each(function() {
    $this = $(this);

    $this.on('touchend',function(e) {
      console.log(e.originalEvent);
    })
  });
});