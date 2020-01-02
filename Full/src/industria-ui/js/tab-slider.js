//--TAB-SLIDER
$(document).ready(function () {
    $(".tab-slider-body").hide();
    $(".tab-slider-body:eq(1)").show();
});

$(".tab-slider-nav li").click(function () {
    $(".tab-slider-body").hide();
    var activeTab = $(this).attr("rel");
    $("#" + activeTab).fadeIn();
    if ($(this).attr("rel") == "brand") {
        $('.tab-slider-tabs').addClass('slide');
    } else {
        $('.tab-slider-tabs').removeClass('slide');
    }
    $(".tab-slider-nav li").removeClass("active");
    $(this).addClass("active");
});

//--CHANGE PAGE CONTENT
$(document).ready(function(){
	// When page loads...:
	$(".content-wrapper>div>div").hide(); // Hide all content
  
	/* Check for hashtag in url */
	if (window.location.hash.length>0) {
		console.log(window.location.hash);
		/*find the menu item with this hashtag*/
		$( ".interface-menu li a" ).each(function() {
			if ( $( this ).attr("href") == window.location.hash )
				$( this ).parent().addClass("current").show(); // Activate page in menu
				$( this ).parent().addClass("active").show();
		});
		$(window.location.hash).fadeIn(); // Fade in the active page content
	}
	else { /* no hashtag: */
	  $(".interface-menu li:eq(0)").addClass("current").show(); // Activate first page
	  $(".content-wrapper>div>div:eq(0)").show(); // Show first page content
	}

	// On Click Event (within list-element!)
	$(".interface-menu li").not(".iconography")
		.not(".breakpoints")
		.not(".badges")
		.not(".images")
		.not(".loaders")
		.not(".tooltips")
		.not(".footer-links")
		.not(".pagination-links")
		.not(".tables")
		.not(".video-links")
		.not(".gallery-links")
		.not(".modal-links")
		.not(".subscribe-to-newsletter")
		.not(".blog-links")
		.not(".location-links")
		.not(".top-nav-links")
		.not(".blocks")
		.not(".cta-sections")
		.not(".headers")
		.not(".large-carousels")
		.not(".standard-content-sections")
		.not(".home-page-links")
		.not(".rich-content-pages")
		.not(".privacy-terms-page")
		.not(".contact-page-links")
		.not(".error-pages")
		.on("click",function() {
		$(".interface-menu li").removeClass("current"); // Remove any active class
		$(this).addClass("current"); // Add "current" class to selected page
		
		$(".content-wrapper>div>div").hide(); // Hide all content

    // Find the href attribute value to identify the active page+content:
		var activePage = $(this).find("a").attr("href"); 
		window.location.href = activePage;
		$(activePage).fadeIn(); // Fade in the active page content
	}); // end click method
	
});