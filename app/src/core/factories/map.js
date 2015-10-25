define(function(require) {
	'use strict';

	var ng = require('angular');
	var module = require('./../module');

	module.factory('mapFactory', ['$window', '$q', 'geolocation', function($window, $q, geolocation) {
		return function() {
			var map;
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
						panToLocation(data);
					}
					deferred.resolve();
				});
			}

			function createNewMap(data) {
				var coords = {lat: data.coords.latitude, lng: data.coords.longitude};
				map = new $window.google.maps.Map(element, {
					center: coords,
					zoom: options.zoomLevel,
					streetViewControl: false
				});

				var image = '/content/images/marker.png';
				var marker = new $window.google.maps.Marker({
					position: coords,
					map: map,
					icon: image
				});
			}

			function panToLocation(data) {
				map.panTo({lat: data.coords.latitude, lng: data.coords.longitude});
			}

			return {
				init: initWhenReady
			};
		};
	}]);
});
