var geocoder;
var map;
var service;
var infowindow;
var glympse = new google.maps.LatLng(47.622328,-122.334737);
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	geocoder = new google.maps.Geocoder();
	var mapOptions = {
		zoom: 14
	};
	map = new google.maps.Map(document.getElementById('map'),
		mapOptions);
	directionsDisplay.setMap(map);

	// Try HTML5 geolocation
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude,
											 position.coords.longitude);

			infowindow = new google.maps.InfoWindow({
				map: map,
				position: pos,
				content: 'This is your location!'
			});

			map.setCenter(pos);
		}, function() {
			handleNoGeolocation(true);
		});
	} else {
		handleNoGeolocation(false);
	}
}

function handleNoGeolocation(errorFlag) {
	if (errorFlag) {
		var content = 'Error: The Geolocation service failed.';
	} else {
		var content = 'Error: Your browser doesn\'t support geolocation.';
	}
	var options = {
		map: map,
		position: glympse,
		content: content
	};
	infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
}

function codeAddress() {
	var address = document.getElementById('address').value;
	geocoder.geocode( {'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
			infowindow.setContent(address);
			infowindow.open(map, marker);
			var request = {
				location: results[0].geometry.location,
				radius: '1000'
			};
			service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, POIcallback);
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

function POIcallback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var place = results[i];
			createPOIMarker(results[i]);
		}
	}
}

function createPOIMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
		console.log("omg i clicked a thing");
		calcRoute(place);
	});
}

function calcRoute(destination) {
	var newAddress = address.value;
	console.log(newAddress);
	var request = {
		origin: newAddress,
		destination: destination.name,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
		directionsDisplay.setDirections(response);
		}
	});
}

google.maps.event.addDomListener(window, 'load', initialize);