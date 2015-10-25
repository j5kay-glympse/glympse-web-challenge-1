define(function(require) {
	'use strict';

	var app = require('./../module');
	require('tpl!./search-box.html');

	app.directive('searchBox', [function() {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				term: '=',
				search: '&'
			},
			templateUrl: 'core/directives/search-box.html',
			link: function(scope) {
				scope.term = '';
			}
		};
	}]);
});
