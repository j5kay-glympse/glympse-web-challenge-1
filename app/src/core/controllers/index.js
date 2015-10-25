define(function(require) {
	'use strict';
	var app = require('./../module');

	app.controller('indexCtrl', ['$scope', 'mapFactory', function($scope, mapFactory) {
		$scope.isLoading = true;
		$scope.search = search;
		$scope.searchTerm = '';

		// Setup main map
		var mainMap = mapFactory();
		var element = document.getElementById('main-map');
		mainMap.init(element).then(function() {
			$scope.isLoading = false;
		});

		function search() {
			mainMap.search($scope.searchTerm, function(results) {
				console.log(results);
				$scope.searchResults = results;
				$scope.$digest();
			});
		}
	}]);
});
