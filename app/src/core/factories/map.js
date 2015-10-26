/**
 * Initializes and keeps track of Google maps, each with a user location and points
 * of interest. All map requests should pass through here so we can create a
 * replaceable interface to switch out our map service in the future
 */
define(function(require) {
	'use strict';

	var ng = require('angular');
	var $ = require('jquery');
	var module = require('./../module');

	var markerTooltip = require('text!./../directives/marker-tooltip.html');

	module.factory('mapFactory', [
		'$window', '$q', '$timeout', '$interpolate', 'geolocation', 'searchFactory', 'directionsFactory',
		function($window, $q, $timeout, $interpolate, geolocation, searchFactory, directionsFactory
	) {
		return function() {
			var map;
			var places;
			var directions;
			var markers = [];
			var userMarker;
			var focusedMarker;
			var destinationMarker;
			var currentInfoPopup;
			var element;
			var options = {
				zoomLevel: 15
			};

			geolocation.init();

			/**
			 * Initialize the object when the core maps library has been loaded
			 *
			 * @param _element The element to bind the google map to
			 * @param _options Map options like zoom level
			 * @returns {Function|promise}
			 */
			function initWhenReady(_element, _options) {
				element = _element;

				// Merge the provided options with the default options
				ng.merge(options, ng.copy(_options));
				var deferred = $q.defer();

				// If the map library's not ready, push our init method as a callback
				// to be executed on load of the map library
				if (!$window.map.ready) {
					$window.map.bootstrapper.addCallback(function() {
						_init(deferred);
					});
				} else {
					_init(deferred);
				}

				return deferred.promise;
			}

			/**
			 * Set up the map element, assuming the map library has been loaded
			 *
			 * @private
			 */
			function _init(deferred) {
				geolocation.observe(function(data) {
					if (!map) {
						createNewMap(data);
					} else {
						updateLocation(data);
					}
					deferred.resolve();
				});
			}

			function createNewMap(data) {
				var userCoords = getCoords(data);
				map = new $window.google.maps.Map(element, {
					center: userCoords,
					zoom: options.zoomLevel,
					disableDefaultUI: true
				});

				places = searchFactory(map);
				places.init();

				directions = directionsFactory(map);
				directions.init();

				var win = ng.element($window);
				win.bind('orientationchange resize', function() {

					// Orientationchange doesn't work without a setTimeout
					$timeout(recenter);
				});

				var image = '/content/images/marker.png';
				userMarker = focusedMarker = new $window.google.maps.Marker({
					position: userCoords,
					map: map,
					icon: image
				});

				userMarker.addListener('click', function() {
					focusedMarker = userMarker;
					recenter();
				});
			}

			function updateLocation(data) {
				var userCoords = getCoords(data);
				userMarker.setPosition(userCoords);
			}

			function recenter() {
				map.panTo(focusedMarker.getPosition());
			}

			function getCoords(data) {
				return {lat: data.coords.latitude, lng: data.coords.longitude};
			}

			function search(term, callback) {
				if (places) {
					places.search(term, function(results) {
						if (directions) {
							directions.clear();
						}
						clearAllMarkers();
						addMarkers(results);
						addOptions(results);
						if (callback) {
							callback(results);
						}
					});
				}
			}

			function clearAllMarkers() {
				markers.forEach(function(marker) {
					marker.setMap(null);
				});
			}

			function addMarkers(places) {
				places.forEach(function(place) {
					addMarker(place);
				});
			}

			function addMarker(place) {
				var image = {
					url: place.icon,
					scaledSize: new $window.google.maps.Size(32, 32)
				};
				var marker = new $window.google.maps.Marker({
					position: place.geometry.location,
					map: map,
					icon: image
				});

				marker.addListener('click', function() {
					focusedMarker = marker;
					openInfoPopup(place, marker);
					recenter();
				});

				marker.placeId = place.place_id;

				markers.push(marker);
			}

			function openInfoPopup(place, marker) {
				if (currentInfoPopup) {
					currentInfoPopup.close();
				}
				currentInfoPopup = new $window.google.maps.InfoWindow();
				var content = $interpolate(markerTooltip)(place);
				currentInfoPopup.setContent(content);
				currentInfoPopup.open(map, marker);
				$('#current-tooltip').bind('click', function() {
					place.getDirections();
				});
			}

			function setDestinationMarker(place, marker) {
				if (destinationMarker) {

					// Reset destination marker if previously set
					var defaultImage = {
						url: place.icon,
						scaledSize: new $window.google.maps.Size(32, 32)
					};
					destinationMarker.setIcon(defaultImage);
				}

				destinationMarker = marker;
				var destinationImage = 'content/images/destination.png';
				destinationMarker.setIcon(destinationImage);
			}

			function addOptions(places) {
				places.forEach(function(place) {
					var marker = getMarkerById(place.place_id);
					place.focus = function() {

						// Fit the map to both the user and the destination
						var bounds = new $window.google.maps.LatLngBounds();
						bounds.extend(place.geometry.location);
						bounds.extend(userMarker.getPosition());
						map.fitBounds(bounds);
						openInfoPopup(place, marker);
					};
					place.getDirections = function() {
						directions.getRoute(userMarker.getPosition(), place.geometry.location);
						setDestinationMarker(place, marker);
						openInfoPopup(place, marker);
					};
				});
			}

			function getMarkerById(placeId) {
				var selectedMarker;
				markers.forEach(function(marker) {
					if (marker.placeId === placeId) {
						selectedMarker = marker;
					}
				});
				return selectedMarker;
			}

			function _setPlaces(mock) {
				places = mock;
			}

			function _getPlaces() {
				return places;
			}

			return {
				init: initWhenReady,
				search: search,
				_setPlaces: _setPlaces,
				_getPlaces: _getPlaces
			};
		};
	}]);
});
