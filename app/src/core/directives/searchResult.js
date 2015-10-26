define(function(require) {
	'use strict';

	var app = require('./../module');
	require('tpl!./search-result.html');

	app.directive('searchResult', [function() {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				result: '=',
				close: '&'
			},
			templateUrl: 'core/directives/search-result.html'
		};
	}]);
});
