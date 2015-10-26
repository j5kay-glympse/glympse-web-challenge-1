define(function(require) {
	'use strict';

	var ng = require('angular');
	require('uiRouter');

	return ng.module('app.core', ['ng', 'ui.router']);
});
