define(function(require) {
	'use strict';

	var ng = require('angular');
	require('./app');

	require(['domReady!'], function() {
		ng.bootstrap(window.document.querySelector('body'), ['app']);
	});
});
