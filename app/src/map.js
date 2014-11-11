define(function(require, exports, module) {
	'use strict';
	function GlympseMap() {
		/*global google*/

		var map, geocoder, geopos, service, infowindow, firstMarker;
		var markers = [];
		var glympse = new google.maps.LatLng(47.622328, -122.334737);
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var directionsService = new google.maps.DirectionsService();


		// Initialize the map
		function initialize() {
			geocoder = new google.maps.Geocoder();
			// Styles from SnazzyMaps
			var styleOptions = [{'stylers':[{'hue':'#16a085'},{'saturation':0}]},{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]}];
			var mapOptions = {
				zoom: 14,
				styles: styleOptions
			};
			map = new google.maps.Map(document.getElementById('map'), mapOptions);
			directionsDisplay.setMap(map);

			// Try HTML5 geolocation
			if (navigator.geolocation) {
				navigator.geolocation.watchPosition(function(position) {
					geopos = new google.maps.LatLng(position.coords.latitude,
													position.coords.longitude);
					infowindow = new google.maps.InfoWindow({
						map: map,
						position: geopos,
						content: '<div style="line-height:1.35;overflow:hidden;white-space:nowrap;font-size:1.4em;font-weight:500;">You are here!</div>',
						maxWidth: 1000
					});
					firstMarker = new google.maps.Marker({
						map: map,
						position: geopos,
						icon: {url: '/../content/images/glympse-small.png'},
						animation: google.maps.Animation.BOUNCE
					});
					map.setCenter(geopos);
				}, function() {
					handleNoGeolocation(true);
				});
			} else {
				handleNoGeolocation(false);
			}
		}

		// Geolocation handler - if error, show error, if no error, show location with marker and infowindow
		function handleNoGeolocation(errorFlag) {
			var content;
			if (errorFlag) {
				content = 'Error: The Geolocation service failed.';
			} else {
				content = 'Error: Your browser doesn\'t support geolocation.';
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
			// Get address from user input, create div
			var address = document.getElementById('address').value;
			var addressContent = document.createElement('div');
			addressContent.setAttribute('style',
				'line-height:1.35;overflow:hidden;white-space:nowrap;'); // styles to remove scroll bar
			addressContent.innerHTML = address;

			// Geocode address from user input
			geocoder.geocode({'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					// Clear existing markers from markers array
					deleteMarkers();
					// Clear existing directions from map and start a new directions renderer
					directionsDisplay.setMap(null);
					directionsDisplay = new google.maps.DirectionsRenderer();
					directionsDisplay.setMap(map);

					map.setZoom(14);
					map.setCenter(results[0].geometry.location);

					// Create marker for address from user input
					var marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location,
						icon: {
							path: google.maps.SymbolPath.CIRCLE,
							scale: 8
						}
					});
					markers.push(marker);

					// Initializes search with infowindow of the address from user input.
					infowindow.setContent(addressContent);
					infowindow.open(map, marker);

					// On mouseover, show address from user input in infowindow.
					google.maps.event.addListener(marker, 'mouseover', function() {
						infowindow.setContent(addressContent);
						infowindow.open(map, marker);
					});

					// On click, show address from user input in infowindow.
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.setContent(addressContent);
						infowindow.open(map, marker);
					});
					var request = {
						location: results[0].geometry.location,
						radius: '1500'
					};

					// Calls POIcallback function to create POI markers
					service = new google.maps.places.PlacesService(map);
					service.nearbySearch(request, POIcallback);

				} else {
					console.log('Geocode was not successful for the following reason: ' + status);
				}
			});
		}

		// Sets the map on all markers in the array.
		function setAllMap(map) {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
			}
		}

		// Deletes all markers on map and in markers array.
		function deleteMarkers() {
			setAllMap(null);
			markers = [];
		}

		// Call Places service, iterate through array of POI and create a marker for each.
		function POIcallback(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					var place = results[i];
					createPOIMarker(results[i]);
				}
			}
		}

		// Create POI found from Places service using address from user input.
		function createPOIMarker(place) {
			// Create HTML content for infowindow
			var placeContent = document.createElement('div');
			var placeName = document.createElement('h3');
			placeContent.setAttribute('style',
				'padding:0 10px 20px 10px;line-height:1.35;overflow:hidden;white-space:nowrap;'); // styles to remove scroll bar
			placeName.innerHTML = place.name + '<br/>';
			placeContent.appendChild(placeName);

			// Get Place photos and put into HTML content for infowindow.
			var placePhotos = place.photos;
			if (placePhotos) {
				var placePhotoURL = placePhotos[0].getUrl({'maxWidth': 100, 'maxHeight': 100});
				var placePhoto = document.createElement('img');
				placePhoto.setAttribute('src', placePhotoURL);
				placeContent.appendChild(placePhoto);
			}

			// Create a marker from Places service and push to markers array.
			var marker = new google.maps.Marker({
				map: map,
				position: place.geometry.location,
				animation: google.maps.Animation.DROP
			});
			markers.push(marker);

			// On mouseover show infowindow associated with POI.
			google.maps.event.addListener(marker, 'mouseover', function() {
				infowindow.setContent(placeContent);
				infowindow.open(map, this);
			});

			// On click show infowindow for and directions to POI.
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent(placeContent);
				infowindow.open(map, this);
				calcRoute(place.geometry.location);
			});
		}

		// Calculates the route from user geolocation to destination.
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

		$(document).ready(function() {
			initialize();
			$('#geocode-form').on('submit', function(e) {
				e.preventDefault();
				codeAddress();
			});
		});
	}
	module.exports = GlympseMap;
});
