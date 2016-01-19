/* globals define */
define(function(require, exports, module) {
	'use strict';
	// import dependencies
	var $ = require('jquery');
	console.log('Map Challenge! - size=' + $(document).width() + 'x' + $(document).height());
	
	initMap();
});

document.addEventListener('DOMContentLoaded', function() {
	initMap();
}, false);

var google, infoWindow, service, map, userPos, userMarker, directionsDisplay, directionsService, dest;
function initMap() {
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -47.545, lng: -122.267},
		zoom: 13,
		styles: [{
			stylers: [{ visibility: 'simplified' }]
		}, {
			elementType: 'labels',
			stylers: [{ visibility: 'off' }]
		}]
	});
	
	//init directions services
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	
	
	getUserLoc();
}

//get the user location and put marker on the map
//if no geolocation, alert user
function getUserLoc() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			userPos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			
			//add info box for user's info
			infoWindow = new google.maps.InfoWindow({map: map});
			infoWindow.setPosition(userPos);
			map.setCenter(userPos);
			infoWindow.setContent('You are here.<br>Lat, Long: ' + map.getCenter());
			infoWindow.setOptions({ pixelOffset: new google.maps.Size(2, 0) });
			
			//add the marker for your location
			userMarker = new google.maps.Marker({
				map: map,
				position: userPos,
				icon: {
					url: '../content/images/icon28.png',
					anchor: new google.maps.Point(10, 10),
					scaledSize: new google.maps.Size(25, 25)
				},
				animation: google.maps.Animation.DROP
			});
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
		
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
		$('#map').before('<div class="alert alert-danger" role="alert">Geolocation not supported.</div>');
	}
	
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	$('#map').before('<div class="alert alert-danger" role="alert">Geolocation failed.</div>');
}



//execute search for nearby POIs
function performSearch(searchQuery) {
	var request = {
		bounds: map.getBounds(),
		keyword: searchQuery
	};
	
	//add the places service
	service = new google.maps.places.PlacesService(map);
	service.radarSearch(request, callback);
}

//return results of search
function callback(results, status) {
	if (status !== google.maps.places.PlacesServiceStatus.OK) {
		console.error(status);
		$('#map').before('<div class="alert alert-warning" role="alert">No results found</div>');
		return;
	}
	//for each result, add a marker on the map
	for (var i = 0; i < results.length; i++) {
		addMarker(results[i]);
	}
}

//add markers for the search results to the map
function addMarker(place) {
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: {
			url: 'http://maps.gstatic.com/mapfiles/circle.png',
			anchor: new google.maps.Point(10, 10),
			scaledSize: new google.maps.Size(10, 17)
		}
	});
	
	//when markers are clicked, open window that contains result name, address and route setting
	google.maps.event.addListener(marker, 'click', function() {
		service.getDetails(place, function(result, status) {
			if (status !== google.maps.places.PlacesServiceStatus.OK) {
				console.error(status);
				return;
			}
			var icon = result.icon;
			marker.setIcon({
				url: icon,
				anchor: new google.maps.Point(10, 10),
				scaledSize: new google.maps.Size(20, 20)
			});
			dest = result.vicinity;
			
			var setRoute = '<br><a href="javascript:calcRoute(dest)">Route here</a>';
			infoWindow.setContent(result.name + '<br>' + result.vicinity + setRoute);
			infoWindow.open(map, marker);
			
			//center map between user and destination
			var destPos = result.geometry.location;
			var bound = new google.maps.LatLngBounds();
			bound.extend(new google.maps.LatLng(userPos.lat,userPos.lng));
			bound.extend(new google.maps.LatLng(destPos.lat(),destPos.lng()));
			var center = bound.getCenter();
			map.setCenter(center);
		});
	});
}

//calculate the route to the destination and plot it
function calcRoute(dest) {
	infoWindow.close();
	var request = {
		origin:userPos,
		destination:dest,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
		}
	});
}

//add handler for search
$('#dest_search').submit(function(e) {
	e.preventDefault();
	var input = $('#dest_input').val();
	console.log('Search submitted: ' + input);
	
	//check if input is blank
	$('.alert-warning').remove();
	if (input.trim() == '') {
		$(this).after('<div class="alert alert-warning" role="alert">Please enter a destination.</div>');
		return;
	}
	performSearch(input);
});
