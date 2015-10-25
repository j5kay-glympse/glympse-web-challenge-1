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
					directionsDisplay.setMap(map);
				}
			}

			function getRoute(origin, destination) {
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

			return {
				init: init,
				getRoute: getRoute
			};
		};
	}]);
});
