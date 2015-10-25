define(function(require) {
	'use strict';

	var ng = require('angular');
	var module = require('./../module');

	module.factory('mapFactory', ['$window', '$q', '$timeout', 'geolocation', function($window, $q, $timeout, geolocation) {
		return function() {
			var map;
			var userMarker;
			var currentMarker;
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

				var w = ng.element($window);
				w.bind('orientationchange resize', function() {

					// Orientationchange doesn't work without a setTimeout
					$timeout(recenter);
				});

				var image = '/content/images/marker.png';
				userMarker = currentMarker = new $window.google.maps.Marker({
					position: userCoords,
					map: map,
					icon: image
				});

				userMarker.addListener('click', function() {
					currentMarker = userMarker;
					recenter();
				});
			}

			function updateLocation(data) {
				var userCoords = getCoords(data);
				userMarker.setPosition(userCoords);
			}

			function recenter() {
				map.panTo(currentMarker.getPosition());
			}

			function getCoords(data) {
				return {lat: data.coords.latitude, lng: data.coords.longitude};
			}

			return {
				init: initWhenReady
			};
		};
	}]);
});
