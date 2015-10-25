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
				results: '=',
				search: '&'
			},
			templateUrl: 'core/directives/search-box.html',
			link: function(scope) {
				scope.term = '';
				scope.results = [];

				scope.close = function() {
					scope.showResults = false;
				};
				scope.open = function() {
					scope.showResults = true;
				};
				scope.$watch('results', function() {
					scope.hasResults = scope.results.length > 0;
					if (scope.hasResults) {
						scope.showResults = true;
					}
				});
			}
		};
	}]);
});
