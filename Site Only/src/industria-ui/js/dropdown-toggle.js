//--DROP-DOWN-MENU
$(document).ready(function () {
    $(".interface-menu > li > a").on("click", function (e) {
        if ($(this).parent().has("ul")) {
            e.preventDefault();
        }
        if (!$(this).hasClass("open")) {
            // hide any open menus and remove all other classes
            $(".interface-menu li ul").slideUp(350);
            $(".interface-menu li a").removeClass("open");

            // open our new menu and add the open class
            $(this).next("ul").slideDown(350);
            $(this).addClass("open");
        }

        else if ($(this).hasClass("open")) {
            $(this).removeClass("open");
            $(this).next("ul").slideUp(350);
        }
    });
});

//--SCROLL
$(document).ready(function () {

    var scrollLink = $('.scroll-link');

    // Smooth scrolling
    scrollLink.on("click", function (e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: $(this.hash).offset().top - 50
        }, 0.2);
    });

    // Active link switching
    $(window).scroll(function () {
        var scrollbarLocation = $(this).scrollTop();

        scrollLink.each(function () {

            var sectionOffset = $(this.hash).offset().top;

            if (sectionOffset <= scrollbarLocation) {
                $(this).parent().addClass('active');
                $(this).parent().siblings().removeClass('active');
            }
        });

    });

});
