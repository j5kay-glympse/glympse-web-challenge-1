/* globals define, it, describe, expect, beforeEach, module, inject, spyOn */
define(function(require) {
	'use strict';

	require('./notification');
	require('angularMocks');

	describe('notification', function() {
		var notificationService, windowMock;

		beforeEach(function() {
			module(function($provide) {
				$provide.value('$window', {
					alert: function() {}
				});
			});
			module('app.core');
			inject(function(notification, $window) {
				notificationService = notification;
				windowMock = $window;
				spyOn(windowMock, 'alert');
			});
		});

		it('alerts on error', function() {
			notificationService.error('test');
			expect(windowMock.alert).toHaveBeenCalled();
		});

	});
});
