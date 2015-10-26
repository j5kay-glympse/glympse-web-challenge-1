/* globals define, it, describe, expect, beforeEach, module, inject, spyOn */
define(function(require) {
	'use strict';

	require('./search');
	require('angularMocks');

	describe('search', function() {
		var directionsFact, windowMock;

		beforeEach(function() {
			module(function($provide) {
				$provide.value('$window', {
					alert: function() {},
					google: {
						maps: {
							TravelMode: {
								DRIVING: 'DRIVING'
							},
							DirectionsStatus: {
								OK: 'OK'
							},
							DirectionsService: function() {
								return {
									route: function(options, callback) {
										callback({}, 'OK');
									}
								};
							},
							DirectionsRenderer: function() {
								return {
									setDirections: function() {},
									setMap: function() {}
								};
							}
						}
					}
				});
			});
			module('app.core');
			inject(function($window, directionsFactory) {
				directionsFact = directionsFactory;
				windowMock = $window;
			});
		});

		it('inits a directionsService and a directionsRenderer object', function() {
			spyOn(windowMock.google.maps, 'DirectionsService');
			spyOn(windowMock.google.maps, 'DirectionsRenderer').and.callThrough();
			var map = {map: true};
			var directions = directionsFact(map);
			directions.init();
			expect(windowMock.google.maps.DirectionsService).toHaveBeenCalled();
			expect(windowMock.google.maps.DirectionsRenderer).toHaveBeenCalled();
		});

		it('finds a route and sets the directions on the directions display', function() {
			var map = {map: true};
			var directions = directionsFact(map);
			directions.init();

			var directionsDisplay = directions._getDirectionsDisplay();
			spyOn(directionsDisplay, 'setDirections');
			directions.getRoute('from', 'to');

			expect(directionsDisplay.setDirections).toHaveBeenCalled();
		});
	});
});
