/* globals define */
define(function(require, exports, module) {
    'use strict';

	// init raf polyfill
	require('famousAnimationFrame');

	// import dependencies
    var $ = require('jquery');
	var getUserLocation = require('getUserLocation');

	// Init google maps
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 47.6097, lng: -122.3331},
		zoom: 13
	});

	// Init info window
	var infoWindow = new google.maps.InfoWindow({map: map});

	// get our users location on the map via geolocation
	getUserLocation(map, infoWindow);

});
