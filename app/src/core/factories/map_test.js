/* globals define, it, describe, expect, beforeEach, module, inject, spyOn */
define(function(require) {
	'use strict';

	require('./map');
	require('./search');
	require('angularMocks');

	describe('map', function() {
		var mapFact, searchFact, windowMock, geolocationService;

		beforeEach(function() {
			module(function($provide) {
				$provide.value('$window', {
					map: {
						ready: true,
						bootstrapper: {
							addCallback: function() {}
						}
					},
					google: {
						maps: {
							Map: function() {
								return {
									panTo: function() {},
									getBounds: function() {}
								};
							},
							places: {
								PlacesService: function() {
									return {
										nearbySearch: function() {}
									};
								}
							},
							Marker: function() {
								return {
									addListener: function() {},
									setPosition: function() {},
									setMap: function() {}
								};
							}
						}
					}
				});
			});
			module('app.core');
			inject(function(mapFactory, $window, geolocation, searchFactory) {
				mapFact = mapFactory;
				searchFact = searchFactory;
				windowMock = $window;
				geolocationService = geolocation;
				geolocationService.init = function() {};
				geolocationService.observe = function() {};
				spyOn(windowMock.map.bootstrapper, 'addCallback');
				spyOn(windowMock.google.maps, 'Map').and.callThrough();
			});
		});

		it('registers a callback if $window.map.ready is not set', function() {
			windowMock.map.ready = false;
			var map = mapFact();
			map.init();
			expect(windowMock.map.bootstrapper.addCallback).toHaveBeenCalled();
		});

		it('inits immediately if $window.map.ready is set', function() {
			windowMock.map.ready = true;
			spyOn(geolocationService, 'observe');
			var map = mapFact();
			map.init();
			expect(geolocationService.observe).toHaveBeenCalled();
		});

		it('creates a new map only once', function() {
			geolocationService.observe = function(callback) {
				callback({
					coords: {
						latitude: 1,
						longitude: 1
					}
				});
			};

			var map = mapFact();
			map.init();
			map.init();

			expect(windowMock.google.maps.Map.calls.count()).toBe(1);
		});

		it('calls the callback after searching', function() {
			windowMock.map.ready = true;
			geolocationService.observe = function(callback) {
				callback({
					coords: {
						latitude: 1,
						longitude: 1
					}
				});
			};

			var map = mapFact();
			map.init();

			map._setPlaces({
				search: function(term, callback) {
					callback([{
						geometry: {
							location: {lat: 1, long: 1}
						}
					}]);
				}
			});

			var callbacksExecuted = 0;
			function callback() {
				callbacksExecuted++;
			}
			map.search('test', callback);

			expect(callbacksExecuted).toBe(1);
		});

	});
});
