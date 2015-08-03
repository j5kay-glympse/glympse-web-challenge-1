/* globals define */
define(function(require, exports, module) {
    'use strict';

    // import dependencies
    var $ = require('jquery');
});


var map;
var initialLocation;
var placesService;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var markers = [];
var infoWindow = new google.maps.InfoWindow();;
var sidebarHtml = '';

// some base locations
var nowhere = new google.maps.LatLng(60, 105);
var seattle = new google.maps.LatLng(47.6097, -122.3331);
var glympsehq = new google.maps.LatLng(47.613734, -122.318008);

var browserSupportFlag =  new Boolean();
var gMarkerIcon = '../content/images/g50px.png';

// map options
var mapOptions = {
	zoom: 15,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

function initMap() {
	// init map
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// init places service
	placesService = new google.maps.places.PlacesService(map);

	// init directions service
	directionsDisplay = new google.maps.DirectionsRenderer();
	// connect map to directions service
	directionsDisplay.setMap(map);
	// attach directions panel
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));

	//debug
	console.log("Searching for your current location...");
	// get user location and drop custom 'G' marker
	getUserLocation();
}

function getUserLocation() {
	// try normal w3c geolocation
	if (navigator.geolocation) {
		browserSupportFlag = true;
		navigator.geolocation.getCurrentPosition(function(position) {
			//debug
			console.log('Retrieved your position as Lat: ' + position.coords.latitude + ', Long: ' + position.coords.longitude);

			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(initialLocation);

			// show marker at current/initial location
			var currentLocationMarker = new google.maps.Marker({
				position: initialLocation,
				map: map,
				icon: gMarkerIcon,
				title: 'Current Location'
			});
		}, function() {
			handleNoGeolocation(browserSupportFlag);
		});
	}
	// geolocation not supported
	else {
		browserSupportFlag = false;
		handleNoGeolocation(browserSupportFlag);
	}
}

function handleNoGeolocation(errorFlag) {
	if (errorFlag == true) {
		alert("Geolocation service failed.");
		initialLocation = seattle;
	} else {
		alert("Your browser doesn't support geolocation. We've placed you in nowhere-land.");
		initialLocation = nowhere;
	}

	map.setCenter(initialLocation);
}

function setActiveMarker(i) {
	// when user clicks on place detail in sidebar:
	// 1 - activate corresponding marker
	google.maps.event.trigger(markers[i], 'click');
	// 2 - display route to dest. on map
	displayDirections(markers[i].position);
}

function searchNearby() {
	var requestNearby = {
		location: initialLocation,
		radius: 700,
		types: ['food', 'cafe', 'bar', 'restaurant', 'bakery', 'meal-takeaway', 'meal_delivery']
	};

	// search nearby POIs
	placesService.nearbySearch(requestNearby, function (results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			// add marker to map per POI result
			for (var i = 0; i < results.length; i++) {
			  createMarker(results[i]);
			}
		}
	});
}

function searchByText(searchString) {
	console.log('searching for --> ' + searchString);

	// search places-service by text
	var searchOptions = {
		location: initialLocation,
		radius: '700',
		query: searchString,
		rankBy: google.maps.places.RankBy.DISTANCE
	};

	placesService.textSearch(searchOptions, function (results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			var resultsJson = {
				results: results
			}

			// place marker per result
			for (var i = 0; i < results.length; i++) {
				var place = results[i];
				createMarker(results[i]);
			}

			// add sidebarHtml to page
			$('#placesContainer').append(sidebarHtml);
		}
	});
}

function createMarker(place) {
	var placeDetailsHtml;

	// init new marker
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
		placesService.getDetails(place, function(result, status) {
			if (status != google.maps.places.PlacesServiceStatus.OK) {
				alert(status);
				return;
			}

			var placeUrl = '';
			// only display website url if exists
			if (result.website !== undefined) {
				placeUrl = '<a href="' + result.website + '" target="_blank">' + result.website + '</a>'
			}

			var infoWindowContentString = '<strong>' + result.name + '</strong>'+ '<br>' +
											result.formatted_address + '<br>' +
											result.formatted_phone_number + '<br>' +
											placeUrl + '<br>';

			// add html content to infoWindow
			infoWindow.setContent(infoWindowContentString);
			// open infoWindow
			infoWindow.open(map, marker);

		});
	});

	markers.push(marker);

	placeDetailsHtml = '<a href="javascript:setActiveMarker(' + (markers.length-1) +')"><div class="placeDetails"><h4>' + place.name + '</h4><div>' + place.formatted_address + '</div></div></a>';

	sidebarHtml += placeDetailsHtml;
}

function clearAllMarkers () {
	// clear markers
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];

	// clear sidebar details
	$('#placesContainer').html('');
}

function displayDirections(dest) {
	// route config for directions service
	var routeConfig = {
		origin: initialLocation,
		destination: dest,
		travelMode: google.maps.TravelMode.WALKING
	};

	directionsService.route(routeConfig, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
		}
	});
}


// load map
google.maps.event.addDomListener(window, 'load', initMap);

// configure buttons event handlers
$('#searchNearbyBtn').on('click', function() {
	console.log('Searching for nearby lunch options...');
	searchNearby();
});

$('#searchByTextBtn').on('click', function() {
	var searchText = $('#searchByTextInput').val();
	searchByText(searchText);
});

$('#clearAllMarkersBtn').on('click', function() {
	console.log('Clearing all markers from map');
	clearAllMarkers();
});

// END OF LINE
