/* globals define, it, describe, expect */
define(function(require) {
	'use strict';

	var main = require('./main');
	describe('main', function() {
		it('passes a single test', function() {
			expect(true).toEqual(true);
		});
	});
});
