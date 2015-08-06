/* globals define */
define(function(require, exports, module) {
    'use strict';

    // import dependencies
    var $ = require('jquery');

	require(['googlemaps!'], function(gmaps) {
		// gmaps is now available as `gmaps`
		var map;
		var initialLocation;
		var placesService;
		var directionsDisplay;
		var directionsService = new gmaps.DirectionsService();
		var markers = [];
		var infoWindow = new gmaps.InfoWindow();
		var sidebarHtml = '';

		// some base locations
		var nowhere = new gmaps.LatLng(60, 105);
		var seattle = new gmaps.LatLng(47.6097, -122.3331);
		var glympsehq = new gmaps.LatLng(47.613734, -122.318008);

		var browserSupportFlag;
		var gMarkerIcon = '../content/images/g50px.png';

		// map options
		var mapOptions = {
			zoom: 15,
			mapTypeId: gmaps.MapTypeId.ROADMAP
		};

		function initMap() {
			// init map
			map = new gmaps.Map(document.getElementById('map-canvas'), mapOptions);

			// init places service
			placesService = new gmaps.places.PlacesService(map);

			// init directions service
			directionsDisplay = new gmaps.DirectionsRenderer();
			// connect map to directions service
			directionsDisplay.setMap(map);
			// attach directions panel
			directionsDisplay.setPanel(document.getElementById('directionsPanel'));

			//debug
			console.log('Searching for your current location...');
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

					initialLocation = new gmaps.LatLng(position.coords.latitude, position.coords.longitude);
					map.setCenter(initialLocation);

					// show marker at current/initial location
					var currentLocationMarker = new gmaps.Marker({
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
				console.log('Geolocation service failed.');
				initialLocation = seattle;
			} else {
				console.log('Your browser does not support geolocation. We have placed you in nowhere-land.');
				initialLocation = nowhere;
			}

			map.setCenter(initialLocation);
		}

		function setActiveMarker(i) {
			// when user clicks on place detail in sidebar:
			// 1 - activate corresponding marker
			gmaps.event.trigger(markers[i], 'click');
			// 2 - display route to destination on map
			displayDirections(markers[i].position);
		}

		function searchByText(searchString) {
			console.log('searching for --> ' + searchString);

			// clear sidebar details if any
			$('#placesContainer').html('');
			// reset sidebarHtml var
			sidebarHtml = '';

			// search places-service by text
			var searchOptions = {
				location: initialLocation,
				radius: '700',
				query: searchString,
				rankBy: gmaps.places.RankBy.DISTANCE
			};

			placesService.textSearch(searchOptions, function(results, status) {
				if (status == gmaps.places.PlacesServiceStatus.OK) {
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
			var marker = new gmaps.Marker({
				map: map,
				position: place.geometry.location
			});

			gmaps.event.addListener(marker, 'click', function() {
				placesService.getDetails(place, function(result, status) {
					if (status != gmaps.places.PlacesServiceStatus.OK) {
						console.log(status);
						return;
					}

					var placeUrl = '';
					// only display website url if exists
					if (result.website !== undefined) {
						placeUrl = '<a href="' + result.website + '" target="_blank">' + result.website + '</a>';
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


		function displayDirections(destination) {
			// route config for directions service
			var routeConfig = {
				origin: initialLocation,
				destination: destination,
				travelMode: gmaps.TravelMode.WALKING
			};

			directionsService.route(routeConfig, function(result, status) {
				if (status == gmaps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(result);
				}
			});
		}

		// configure search button event handler
		$('#searchByTextBtn').on('click', function() {
			var searchText = $('#searchByTextInput').val();
			searchByText(searchText);
		});

		// init map
		initMap();
	});
});
