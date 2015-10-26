/* globals define, it, describe, expect, beforeEach, module, inject, spyOn */
define(function(require) {
	'use strict';

	require('./geolocation');
	require('./notification');
	require('angularMocks');

	describe('geolocation', function() {
		var notificationService, geolocationService, windowMock;

		beforeEach(function() {
			module(function($provide) {
				$provide.value('$window', {
					navigator: {
						geolocation: {
							watchPosition: function(onSuccess, onError) {}
						}
					}
				});
			});
			module('app.core');
			inject(function($window, notification, geolocation) {
				notificationService = notification;
				spyOn(notificationService, 'error');
				geolocationService = geolocation;
				windowMock = $window;
			});
		});

		it('inits once', function() {
			spyOn(windowMock.navigator.geolocation, 'watchPosition');
			geolocationService.init();
			geolocationService.init();
			expect(windowMock.navigator.geolocation.watchPosition.calls.count()).toBe(1);
		});

		it('notifies on error', function() {
			geolocationService._onError({error: 1});
			expect(notificationService.error).toHaveBeenCalled();
		});

		it('notifies observers on update', function() {
			var callbacksExecuted = 0;
			function callback() {
				callbacksExecuted++;
			}
			geolocationService.observe(callback);
			geolocationService.observe(callback);

			geolocationService._updatePosition();

			expect(callbacksExecuted).toEqual(2);
		});
	});
});
