(function($){
    "use strict";
  
    $.fn.owlCarouselWithExternalCounter = function (options) {
      var counter = options.externalCounter;
  
      this.owlCarousel($.extend({}, options, {
        onInitialized: onInitialized,
        onTranslated: onTranslated,
      }));
  
      return this;
  
      function updateCounterFromEvent(event) {
        var visibleItems = event.page.size;
        var pages = event.page.count;
        if (!pages) {
          var totalItems = event.item.count;
          pages = Math.ceil(totalItems / visibleItems);
        }
        var page = event.page.index + 1;
        if (page < 1) {
          page = event.item.index + 1;
        }
        $(counter).html(" <span>" + page + "</span> / " + pages);
      }
  
      function onInitialized(event) {
        setTimeout(function() {
          updateCounterFromEvent(event);
        }, 0);
        // Call passed callback in options if any
        if (typeof options.onInitialized === 'function') {
          return options.onInitialized.apply(this, arguments);
        }
      }
  
      function onTranslated(event) {
        updateCounterFromEvent(event);
        // Call passed callback in options if any
        if (typeof options.onTranslated === 'function') {
          return options.onTranslated.apply(this, arguments);
        }
      }
    }
  
  })(jQuery);
  