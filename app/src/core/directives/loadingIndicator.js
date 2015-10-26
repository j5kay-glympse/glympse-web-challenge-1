define(function(require) {
	'use strict';

	var app = require('./../module');
	require('tpl!./loading-indicator.html');

	app.directive('loadingIndicator', [function() {
		return {
			restrict: 'A',
			replace: true,
			scope: false,
			templateUrl: 'core/directives/loading-indicator.html'
		};
	}]);
});
