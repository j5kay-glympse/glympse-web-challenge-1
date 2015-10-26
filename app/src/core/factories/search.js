/**
 * Point of interest search for Google maps. This service should only be called
 * from factories/map.js
 */
define(function(require) {
	'use strict';

	var module = require('./../module');

	module.factory('searchFactory', ['$window', function($window) {

		return function(map) {
			var placesService;

			function init() {
				if (!placesService) {
					placesService = new $window.google.maps.places.PlacesService(map);
				}
			}

			function search(term, callback) {
				var request = {
					bounds: map.getBounds(),
					keyword: term
				};
				placesService.nearbySearch(request, function(results, status) {
					if (status === $window.google.maps.places.PlacesServiceStatus.OK) {
						callback(results);
					} else if (status === $window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
						callback([]);
					}
				});
			}

			return {
				init: init,
				search: search
			};
		};
	}]);
});
