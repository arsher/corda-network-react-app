document.getElementById('tabs').addEventListener('touchmove', process_touchstart, false);
var touchEnd;
function process_touchstart(e) {
  if (e.touches[0].clientX > touchEnd) {
    $('.tabs-nav').css('marginLeft', "+=" + 15);
  } else {
    $('.tabs-nav').css('marginLeft', "-=" + 15);
  }

  touchEnd = e.touches[0].clientX;
}

$('.tab-1').on('click', function () {
  var innerWidth = window.innerWidth;
  if (innerWidth > '767') {
    $('.selected-tab').css({
      left: '-2px'
    });
    $(this).addClass("selected");
    $(this).siblings().removeClass("selected");
  } else {
    $(this).addClass("selected");
    $(this).siblings().removeClass("selected");
    $('.tabs-nav').css('marginLeft', '0');
  }

  $('#tab-1').css('display', 'flex');
  $('#tab-2').css('display', 'none');
  $('#tab-3').css('display', 'none');
});

$('.tab-2').on('click', function () {
  var innerWidth = window.innerWidth;
  if (innerWidth > '767') {
    $('.selected-tab').css({
      left: "calc(33.333% - 1px)"
    });
    $(this).addClass("selected");
    $(this).siblings().removeClass("selected");
  } else {
    $(this).addClass("selected");
    $(this).siblings().removeClass("selected");
    $('.tabs-nav').css('marginLeft', '-75');
  }

  $('#tab-2').css('display', 'flex');
  $('#tab-1').css('display', 'none');
  $('#tab-3').css('display', 'none');

});

$('.tab-3').on('click', function () {
  var innerWidth = window.innerWidth;
  if (innerWidth > '767') {
    $('.selected-tab').css({
      left: "calc(33.333% * 2)"
    });
    $(this).addClass("selected");
    $(this).siblings().removeClass("selected");
  } else {
    $(this).addClass("selected");
    $(this).siblings().removeClass("selected");
    $('.tabs-nav').css('marginLeft', '-150');
  }

  $('#tab-3').css('display', 'flex');
  $('#tab-1').css('display', 'none');
  $('#tab-2').css('display', 'none');
});
