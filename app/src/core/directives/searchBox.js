define(function(require) {
	'use strict';

	var app = require('./../module');
	require('tpl!./search-box.html');

	app.directive('searchBox', [
		function() {
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
					scope.results = undefined;

					scope.close = function() {
						scope.showResults = false;
					};
					scope.open = function() {
						scope.showResults = true;
					};
					scope.$watch('results', function() {
						if (scope.results) {
							if (scope.results && scope.results.length > 0) {
								scope.hasResults = true;
								scope.showResults = true;
							} else if (scope.results.length === 0) {
								scope.hasResults = false;
								scope.showResults = false;
							}
						}
					});
				}
			};
		}
	]);
});
