var geocoder;
var map;
var geopos;
var service;
var infowindow;
var markers = [];
var glympse = new google.maps.LatLng(47.622328,-122.334737);
var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();

function initialize() {
	geocoder = new google.maps.Geocoder();
	var mapOptions = {
		zoom: 14
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	directionsDisplay.setMap(map);

	// Try HTML5 geolocation
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			geopos = new google.maps.LatLng(position.coords.latitude,
										 position.coords.longitude);

			infowindow = new google.maps.InfoWindow({
				map: map,
				position: geopos,
				content: 'This is your location!',
				maxWidth: 1000
			});
			var firstMarker = new google.maps.Marker({
				map: map,
				position: geopos,
				icon: {
					url: "/../content/images/glympse-small.png"			    }
			});
			map.setCenter(geopos);
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
		content: content,
		maxWidth: 500
	};
	infowindow = new google.maps.InfoWindow(options);
	map.setCenter(options.position);
}

function codeAddress() {
	var address = document.getElementById('address').value;
	geocoder.geocode( {'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			deleteMarkers();
			directionsDisplay.setMap(null);
			directionsDisplay = new google.maps.DirectionsRenderer();
			directionsDisplay.setMap(map);
			map.setZoom(14);
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location,
				icon: {
					path: google.maps.SymbolPath.CIRCLE,
					scale: 8
				}
			});
			markers.push(marker);
			infowindow.setContent(address);
			infowindow.open(map, marker);
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent(address);
				infowindow.open(map, marker);
			});
			var request = {
				location: results[0].geometry.location,
				radius: '500'
			};
			service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, POIcallback);
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function deleteMarkers() {
  setAllMap(null);
  markers = [];
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
	var placeContent = document.createElement('div');
	var placeName = document.createElement('h3');
	placeContent.setAttribute('style', 'padding:0 10px 20px 10px;line-height:1.35;overflow:hidden;white-space:nowrap;');
	placeName.innerHTML = place.name + "<br/>";
	placeContent.appendChild(placeName);

	var placePhotos = place.photos;
	if (placePhotos) {
		var placePhotoURL = placePhotos[0].getUrl({'maxWidth': 200, 'maxHeight': 200});
		var placePhoto = document.createElement('img');
		placePhoto.setAttribute('src', placePhotoURL);
		placeContent.appendChild(placePhoto);
	}

	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	markers.push(marker);
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(placeContent);
		infowindow.open(map, this);
		calcRoute(place.geometry.location);
	});
}

function calcRoute(destination) {
	var request = {
		origin: geopos,
		destination: destination,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
	});
}

google.maps.event.addDomListener(window, 'load', initialize);