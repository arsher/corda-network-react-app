/*global google */
/*global locations */
/*global markerImage */
/*global updateCounter */

var map;

jQuery(function($) {
  "use strict";

  var $counter = $('#counter-contact');
  var $counterTwo = $('#counter-contact-two');

  var $contactCarousel = $('.owl-carousel-contact');

  var $contactCarouselTwo = $('.owl-carousel-contact-two');

  $contactCarousel.owlCarousel({
    items: 1,
    dots: false,
    nav: false,
    onInitialized: manageContactCarousel,
    onTranslated: manageContactCarousel,
  });

  $contactCarouselTwo.owlCarousel({
    items: 1,
    dots: false,
    nav: false,
    onInitialized: manageContactCarouselTwo,
    onTranslated: manageContactCarouselTwo,
  });

  $('#contactCarouselPrev').on('click', function () {
    console.log(`PREV`);
    $contactCarousel.trigger('prev.owl.carousel');
  });

  $('#contactCarouselNext').on('click', function () {
    console.log(`NEXT`);
    $contactCarousel.trigger('next.owl.carousel');
  });

  $('#contactCarouselPrevTwo').on('click', function () {
    console.log(`PREV`);
    $contactCarouselTwo.trigger('prev.owl.carousel');
  });

  $('#contactCarouselNextTwo').on('click', function () {
    console.log(`NEXT`);
    $contactCarouselTwo.trigger('next.owl.carousel');
  });

  function manageContactCarousel(event) {
    updateCounter($counter, event);
    if (event.type === 'translated') {
      var itemData = $(event.target).find('.owl-item.active .item').data();
      changeLocation(itemData.latitude, itemData.longitude, itemData.name);
    }
  }

  function manageContactCarouselTwo(event) {
    updateCounterTwo($counterTwo, event);
    if (event.type === 'translated') {
      var itemData = $(event.target).find('.owl-item.active .item').data();
      changeLocationTwoItems(itemData.latitude, itemData.longitude, itemData.name);
    }
  }

  $('#_3-locations .location').on('click', function() {
    var data = $(this).data();
    changeLocation(data.latitude, data.longitude, data.name);
  });

  $('#_2-locations .location').on('click', function() {
    var data = $(this).data();
    changeLocationTwoItems(data.latitude, data.longitude, data.name);
  });

  function changeLocation(latitude, longitude, name){
    var dataString = '[data-latitude="' + latitude + '"]';
    $('#_3-locations .location').removeClass('active');
    $('#_3-locations .location' + dataString).addClass('active');

    var count = $('.owl-carousel-contact .owl-item').length;
    var item = $('.owl-carousel-contact .item' + dataString);
    var index = $('.owl-carousel-contact .item').index(item);
    $contactCarousel.trigger('to.owl.carousel', index);
    updateCounter($counter, {item: {count: count, index: index}});

    var location = new google.maps.LatLng(latitude, longitude);
    map.setCenter(location);
  }

  function changeLocationTwoItems(latitude, longitude, name){
    var dataString = '[data-latitude="' + latitude + '"]';
    $('#_2-locations .location').removeClass('active');
    $('#_2-locations .location' + dataString).addClass('active');

    var count = $('.owl-carousel-contact-two .owl-item').length;
    var item = $('.owl-carousel-contact-two .item' + dataString);
    var index = $('.owl-carousel-contact-two .item').index(item);
    $contactCarousel.trigger('to.owl.carousel', index);
    updateCounterTwo($counterTwo, {item: {count: count, index: index}});

    var location = new google.maps.LatLng(latitude, longitude);
    mapTwo.setCenter(location);
  }

  function updateCounter($counter, data) {
    var items = data.item.count;
    var page = data.item.index + 1;
    $counter.html(page + ' / ' + items);
  }

  function updateCounterTwo($counter, data) {
    var items = data.item.count;
    var page = data.item.index + 1;
    $counterTwo.html(page + ' / ' + items);
  }
});

function initMap() {
    "use strict";

    if (!(locations && locations.length)) {
        console.error('Missing locations!!!');
        return;
    } else {
    }
    IsGoogleMapsInViewViewport();
}

var isInViewport = function (elem) {
  var bounding = elem.getBoundingClientRect();
  return (
      (bounding.top - 500) < (bounding.height) // &&
  );
};

function IsGoogleMapsInViewViewport() {
  var googleMap = document.querySelector('#map');
  var googleMapTwo = document.querySelector('#mapTwo');

    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: +locations[0].lattitude,
        lng: +locations[0].longitude
      },
      zoom: 16,
      disableDefaultUI: true,
      styles: [{
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#193341"
          }]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [{
            "color": "#2c5a71"
          }]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
              "color": "#29768a"
            },
            {
              "lightness": -37
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#406d80"
          }]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [{
            "color": "#406d80"
          }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{
              "visibility": "on"
            },
            {
              "color": "#3e606f"
            },
            {
              "weight": 2
            },
            {
              "gamma": 0.84
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#ffffff"
          }]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [{
              "weight": 0.6
            },
            {
              "color": "#1a3541"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#2c5a71"
          }]
        }
      ]
    });

    mapTwo = new google.maps.Map(document.getElementById('mapTwo'), {
      center: {
        lat: +locationsTwo[0].lattitude,
        lng: +locationsTwo[0].longitude
      },
      zoom: 16,
      disableDefaultUI: true,
      styles: [{
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#193341"
          }]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [{
            "color": "#2c5a71"
          }]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
              "color": "#29768a"
            },
            {
              "lightness": -37
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#406d80"
          }]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [{
            "color": "#406d80"
          }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{
              "visibility": "on"
            },
            {
              "color": "#3e606f"
            },
            {
              "weight": 2
            },
            {
              "gamma": 0.84
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#ffffff"
          }]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [{
              "weight": 0.6
            },
            {
              "color": "#1a3541"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#2c5a71"
          }]
        }
      ]
    });
    
    var image = {
        url: markerImage,
        scaledSize: new google.maps.Size(99, 55),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
    };

    for (var index = 0; index < locations.length; index++) {
      var location = new google.maps.LatLng(locations[index].lattitude, locations[index].longitude);
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: image,
        title: locations[index].name
      });
    }

    for (var index = 0; index < locationsTwo.length; index++) {
      var location = new google.maps.LatLng(locationsTwo[index].lattitude, locationsTwo[index].longitude);
      var marker = new google.maps.Marker({
        position: location,
        map: mapTwo,
        icon: image,
        title: locationsTwo[index].name
      });
    }
}

