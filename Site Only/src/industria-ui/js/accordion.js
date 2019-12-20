var acc = document.getElementsByClassName("accordion");
var accArray = Array.from(acc);
var panels = document.getElementsByClassName("panel");
var panelsArr = Array.from(panels);
var i;
var windowWidth = window.innerWidth;
if (windowWidth > 576) {
    (() => {
        $("#panel2").slideUp();
        $("#panel3").slideUp();
    })();
} else {
    (() => {
        $("#panel1").slideUp();
        $("#panel2").slideUp();
        $("#panel3").slideUp();
        $(".accordion:first-of-type").removeClass("active");
    })();
}

$('.accordion').click(function () {

    $(this).toggleClass("active");

    $(this).children(".zmdi").toggleClass("d-none");
    $(this).prevAll('.panel').slideUp();
    $(this).nextAll('.panel').slideUp();

    $(this).prevAll('.accordion').removeClass("active");
    $(this).nextAll('.accordion').removeClass("active");

    if ($(this).next().is(':hidden')) {
        $(this).next().slideDown();
        $(this).addClass("active");
        $(this).siblings('.accordion').children(".zmdi-close-circle-o").addClass("d-none");
        $(this).siblings('.accordion').children(".zmdi-plus-circle-o").removeClass("d-none");
        return false;
    }
    else {
        $(this).next().slideUp();
        $(this).removeClass("active");
        return false;
    }
});