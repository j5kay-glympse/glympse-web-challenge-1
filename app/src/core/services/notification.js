define(function(require) {
	'use strict';

	var module = require('./../module');

	module.service('notification', ['$window', function($window) {

		function error(message) {
			$window.alert(message);
		}

		return {
			error: error
		};
	}]);
});
