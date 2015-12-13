/* globals define */
define(function(require, exports, module) {
	'use strict';

	// import libraries
	var $ = require('jquery');

	// import our map tools
	var getUserLocation = require('getUserLocation');
	var calculateAndDisplayRoute = require('calculateAndDisplayRoute');

	// Init google maps
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 47.6097, lng: -122.3331},
		zoom: 13,
		disableDefaultUI: true,
		zoomControl: true
	});

	// Init info window
	//var infoWindow = new google.maps.InfoWindow({map: map});

	// User Marker
	var userMarker = new google.maps.Marker({
		map: null,
		icon: 'content/images/ic_person_pin_circle_black_36px.svg'
	});

	/**
	 * User Location
	 */

		// get and set our users location on the map via geolocation
	getUserLocation(map, userMarker);

	/**
	 * Place Service
	 */

	var service = new google.maps.places.PlacesService(map);


	/**
	 * Direction Service
	 */

	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	directionsDisplay.setMap(map);

	/**
	 * Destination search service
	 */

	// Create the search box and link it to the UI element.
	var input = document.getElementById('search');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// Results element
	var $results = $('#results');
	var $resultsList = $('#results-list');
	// listen for when a user selects a result
	$resultsList.on('click', 'li', function() {
		hideResults();
		// generate a place object from the place_id
		service.getDetails({
			placeId: $(this).data('id')
		}, function(place, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				navigateTo(place);
			}
		});
	});

	// show search results list
	function showResults() {
		$results.css('display', 'block');
		$results[0].clientHeight; // flush our cache
		$results.addClass('is-active');
	}

	// hide search results list
	function hideResults() {
		$results.removeClass('is-active');
		setTimeout(function() {
			$results.css('display', 'none');
		}, 300);
	}

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	// search result markers
	var markers = [];
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		// Clear out the old markers.
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers.length = 0;

		// Clear out the old search results
		$resultsList.empty();

		// if there are multiple results, display them for the user to select
		if (places.length > 1) {
			// extend the bounds
			places.forEach(function(place) {
				var icon = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25)
				};

				// Create a marker for each place.
				markers.push(new google.maps.Marker({
					map: map,
					icon: icon,
					title: place.name,
					position: place.geometry.location
				}));

				$resultsList.append('<li data-id="' + place.place_id + '">' +
					'<div class="name">' + place.name + '</div>' +
					'<div class="address">' + place.formatted_address + '</div>' +
					'</li>');

			});

			showResults();
		} else {
			// if there is only one result
			// navigate to our destination
			navigateTo(places[0]);
		}

	});

	function navigateTo(place) {
		// Clear out the old markers.
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers.length = 0;
		// get rid of our initial user marker
		userMarker.setMap(null);
		calculateAndDisplayRoute(
			directionsService,
			directionsDisplay,
			userMarker.position,
			place.geometry.location || place.geometry.viewport
		);
		input.value = '';
	}


});
