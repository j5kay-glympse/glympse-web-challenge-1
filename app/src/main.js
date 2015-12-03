/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var $ = require('jquery');

    console.log('Map Challenge! - size=' + $(document).width() + 'x' + $(document).height());

    var GoogleMapsLoader = require('google-maps');

    GoogleMapsLoader.KEY = 'AIzaSyA1X7v2Gd2fmv1VV7Lbg71JbW7OT4Whn9E';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

	GoogleMapsLoader.load(function(google) {
	    var map, mapCanvas, mapOptions;

	    if (!navigator.geolocation) {
	        console.log('geolocation not available')
            return;
        }

        mapCanvas = document.getElementById('map');
        mapOptions = {
          center: new google.maps.LatLng(44.5403, -78.5463),
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        map = new google.maps.Map(mapCanvas, mapOptions);
    });

    GoogleMapsLoader.onLoad(function(google) {
        console.log('I just loaded google maps api');
    });

//    GoogleMapsLoader.release(function() {
//        console.log('No google maps api around');
//    });
});
