/* globals MapBootstrapper, define, it, describe, expect, beforeEach */
define(function(require) {
	'use strict';

	require('./mapBootstrapper');

	describe('mapBootstrapper', function() {
		var bootstrapper;

		beforeEach(function() {
			window.map.ready = undefined;
			bootstrapper = new MapBootstrapper();
		});

		it('sets window.mapBootstrapperCallback', function() {
			expect(typeof window.mapBootstrapperCallback).toEqual('function');
		});

		it('performs all registered callbacks on window.mapBootstrapperCallback', function() {
			var callbacksExecuted = 0;
			function callback() {
				callbacksExecuted++;
			}
			bootstrapper.addCallback(callback);
			bootstrapper.addCallback(callback);

			window.mapBootstrapperCallback();

			expect(callbacksExecuted).toEqual(2);
		});

		it('sets window.map.ready to true on window.mapBootstrapperCallback', function() {
			expect(window.map.ready).toBe(undefined);
			window.mapBootstrapperCallback();
			expect(window.map.ready).toEqual(true);
		});
	});
});
