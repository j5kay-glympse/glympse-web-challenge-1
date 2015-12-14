/* globals define */
define(function(require, exports, module) {
	'use strict';

	// Import libraries
	var $ = require('jquery');
	
	// cache our dom selectors
	var $directions = $('#directions');
	var $results = $('#results');
	var $resultsList = $('#results-list');
	var input = document.getElementById('search');
	var searchBtn = document.getElementById('search-btn');

	// Import our map functions
	var getUserLocation = require('getUserLocation');
	var calculateAndDisplayRoute = require('calculateAndDisplayRoute');
	var showPanel = require('showPanel');
	var hidePanel = require('hidePanel');

	// Initialize google maps
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 47.6097, lng: -122.3331},
		zoom: 13,
		disableDefaultUI: true,
		zoomControl: true
	});
	
	// Initialize our services
	var placeService = new google.maps.places.PlacesService(map);
	var elevationService = new google.maps.ElevationService();
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
	// Link the direction renderer to the directions element
	directionsDisplay.setPanel(document.getElementById('directions'));
	
	// Create the search box and link it to the UI element.
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBtn);

	// Create a custom User Marker
	var userMarker = new google.maps.Marker({
		map: null,
		icon: 'content/images/ic_person_pin_circle_black_36px.svg',
		animation: google.maps.Animation.DROP
	});
	
	// Info window for displaying elevation
	var userInfo = new google.maps.InfoWindow();

	// Use this array to store our search result markers
	var markers = [];

	// Get and set our users location on the map via geolocation
	getUserLocation(map, userMarker);
	
	// Show elevation on user marker click
	userMarker.addListener('click', function(event) {
		elevationService.getElevationForLocations({
			locations:[event.latLng]
		}, function(results, status) {
			if (status === google.maps.ElevationStatus.OK && results[0]) {
				userInfo.setContent('Your current elevation in meters: ' + results[0].elevation.toFixed(2));
				userInfo.open(userMarker.get('map'), userMarker);
			}
		});
	});

	// Listen for when a user selects a result
	$resultsList.on('click', 'li', function() {
		hidePanel($results);
		// Generate a place object from the place_id
		placeService.getDetails({
			placeId: $(this).data('id')
		}, function(place, status) {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				navigateTo(place);
				setTimeout(function() {
					showPanel($directions);
				},300);
			}
		});
	});

	// If the user starts typing in the search box, hide visible results or directions
	input.addEventListener('keydown', function() {
		userInfo.close();
		hidePanel($results);
		hidePanel($directions);
		directionsDisplay.setMap(null);
		// Clear out the old markers.
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		// Clear references to old markers
		markers.length = 0;
		userMarker.setVisible(true);
	});

	// Simulate pressing the enter key while focused on the search input
	searchBtn.addEventListener('click', function() {
		userInfo.close();
		google.maps.event.trigger(input, 'focus');
		google.maps.event.trigger(input, 'keydown', {
			keyCode:13
		});
	});

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	// Listen for the event fired when the user selects a prediction
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
		// If no results, don't do anything
		if (places.length === 0) {
			return;
		}
		// Clear out the old search results
		$resultsList.empty();
		// If there are multiple results, display them for the user to select
		if (places.length > 1) {
			// Create an icon specific to the location 
			places.forEach(function(place) {
				var icon = {
					url: place.icon,
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(25, 25)
				};
				// Place a marker at each location
				var m = new google.maps.Marker({
					map: map,
					icon: icon,
					title: place.name,
					position: place.geometry.location
				});
				// If the user clicks on the icon, navigate to it 
				m.addListener('click', function() {
					hidePanel($results);
					navigateTo(place);
					setTimeout(function() {
						showPanel($directions);
					}, 300);
				});
				// Keep track of each active marker
				markers.push(m);
				// Add search result to list
				$resultsList.append('<li data-id="' + place.place_id + '">' +
					'<div class="name">' + place.name + '</div>' +
					'<div class="address">' + place.formatted_address + '</div>' +
					'</li>');
			});
			// Show the results panel
			showPanel($results);
		} else {
			// If there is only one result
			// Navigate to our destination
			navigateTo(places[0]);
			// Show the directions panel
			showPanel($directions);
		}

	});

	// Navigate to our desctination
	function navigateTo(place) {
		// Clear out the old markers.
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers.length = 0;
		// Get rid of our initial user marker
		userMarker.setVisible(false);
		calculateAndDisplayRoute(
			map,
			directionsService,
			directionsDisplay,
			userMarker.position,
			place.geometry.location || place.geometry.viewport
		);
		input.value = '';
	}

});
