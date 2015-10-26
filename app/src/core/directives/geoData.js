define(function(require) {
	'use strict';

	var app = require('./../module');
	require('tpl!./geo-data.html');

	app.directive('geoData', ['geolocation', function(geolocation) {
		return {
			restrict: 'A',
			replace: true,
			scope: {},
			templateUrl: 'core/directives/geo-data.html',
			link: function(scope) {
				geolocation.observe(function(data) {
					if (data.coords.accuracy) {
						scope.accuracy = Math.round(data.coords.accuracy);
					}

					if (data.coords.altitude) {
						scope.altitude = Math.round(data.coords.altitude);
					}

					if (data.coords.heading) {
						scope.heading = Math.round(data.coords.heading);
					}

				});
			}
		};
	}]);
});
