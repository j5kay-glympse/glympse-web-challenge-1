define(function(require) {
	'use strict';

	var module = require('./../module');

	module.service('map', ['$window', function($window) {
		if (!window.mapIsReady) {
			$window.initMap = init;
		} else {
			init();
		}

		function init() {
			console.log('Map has been started successfully!');
		}
	}]);
});
