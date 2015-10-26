/* globals define, it, describe, expect, beforeEach, module, inject, spyOn */
define(function(require) {
	'use strict';

	require('./map');
	require('./search');
	require('./directions');
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
							Size: function() {},
							Map: function() {
								return {
									panTo: function() {},
									getBounds: function() {},
									fitBounds: function() {}
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
									addListener: function(type, callback) {
										callback();
									},
									setPosition: function() {},
									getPosition: function() {},
									setMap: function() {},
									setIcon: function() {}
								};
							},
							DirectionsService: function() {
								return {
									route: function() {}
								};
							},
							DirectionsRenderer: function() {
								return {
									setMap: function() {}
								};
							},
							InfoWindow: function() {
								return {
									setContent: function() {},
									open: function() {},
									close: function() {}
								};
							},
							LatLngBounds: function() {
								return {
									extend: function() {}
								};
							},
							TravelMode: {
								DRIVING: 'DRIVING'
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

		function setupSearch() {
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

			return map;
		}

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
			var map = setupSearch();

			var callbacksExecuted = 0;
			function callback() {
				callbacksExecuted++;
			}
			map.search('test', callback);

			expect(callbacksExecuted).toBe(1);
		});

		it('attaches focus and getDirections callbacks to places array', function() {
			var map = setupSearch();

			var placesArray;
			function callback(data) {
				placesArray = data;
			}
			map.search('test', callback);

			expect(placesArray.length).toBe(1);
			var place = placesArray[0];
			expect(typeof place.focus).toEqual('function');
			expect(typeof place.getDirections).toEqual('function');

			place.focus();
			place.getDirections();
		});

	});
});
