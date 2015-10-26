define(function(require) {
	'use strict';
	var app = require('./../module');
	var $ = require('jquery');

	app.controller('indexCtrl', ['$scope', 'mapFactory', function($scope, mapFactory) {
		$scope.isLoading = true;
		$scope.search = search;
		$scope.searchTerm = '';

		// Set up main map
		var mainMap = mapFactory();
		var element = $('#main-map')[0];
		mainMap.init(element).then(function() {
			$scope.isLoading = false;
		});

		function search() {
			mainMap.search($scope.searchTerm, function(results) {
				$scope.searchResults = results;
				$scope.$digest();
			});
		}
	}]);
});
