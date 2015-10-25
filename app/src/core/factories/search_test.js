/* globals define, it, describe, expect, beforeEach, module, inject, spyOn */
define(function(require) {
	'use strict';

	require('./search');
	require('angularMocks');

	describe('search', function() {
		var searchFact, windowMock;

		beforeEach(function() {
			module(function($provide) {
				$provide.value('$window', {
					google: {
						maps: {
							places: {
								PlacesService: function() {
									return {
										nearbySearch: function(request, callback) {
											callback();
										}
									};
								},
								PlacesServiceStatus: {
									OK: undefined
								}
							}
						}
					}
				});
			});
			module('app.core');
			inject(function($window, searchFactory) {
				searchFact = searchFactory;
				windowMock = $window;
			});
		});

		it('inits a PlacesService', function() {
			spyOn(windowMock.google.maps.places, 'PlacesService');
			var map = {map: true};
			var places = searchFact(map);
			places.init();
			expect(windowMock.google.maps.places.PlacesService).toHaveBeenCalledWith(map);
		});

		it('inits a PlacesService only once', function() {
			spyOn(windowMock.google.maps.places, 'PlacesService');
			var map = {map: true};
			var places = searchFact(map);
			places.init();
			places.init();
			expect(windowMock.google.maps.places.PlacesService.calls.count()).toBe(1);
		});

		it('searches', function() {
			var map = {getBounds: function() {}};
			var places = searchFact(map);
			places.init();

			var callbacksExecuted = 0;
			function callback() {
				callbacksExecuted++;
			}
			places.search('test', callback);
			expect(callbacksExecuted).toBe(1);
		});
	});
});
