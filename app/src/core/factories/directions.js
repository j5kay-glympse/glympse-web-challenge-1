define(function(require) {
	'use strict';

	var module = require('./../module');

	module.factory('directionsFactory', ['$window', 'notification', function($window, notification) {

		return function(map) {
			var directionsService;
			var directionsDisplay;

			function init() {
				if (!directionsService) {
					directionsService = new $window.google.maps.DirectionsService();
				}
				if (!directionsDisplay) {
					directionsDisplay = new $window.google.maps.DirectionsRenderer({
						suppressMarkers: true
					});
				}
			}

			function getRoute(origin, destination) {
				directionsDisplay.setMap(map);
				directionsService.route({
					origin: origin,
					destination: destination,
					travelMode: $window.google.maps.TravelMode.DRIVING
				}, function(response, status) {
					if (status === $window.google.maps.DirectionsStatus.OK) {
						directionsDisplay.setDirections(response);
					} else {
						notification.error('Directions request failed due to ' + status);
					}
				});
			}

			function clear() {
				directionsDisplay.setMap(null);
			}

			function _getDirectionsDisplay() {
				return directionsDisplay;
			}

			return {
				init: init,
				getRoute: getRoute,
				clear: clear,
				_getDirectionsDisplay: _getDirectionsDisplay
			};
		};
	}]);
});
