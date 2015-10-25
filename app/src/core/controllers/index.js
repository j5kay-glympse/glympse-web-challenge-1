define(function(require) {
	'use strict';
	var app = require('./../module');

	app.controller('indexCtrl', ['$scope', 'mapFactory', function($scope, mapFactory) {
		$scope.isLoading = true;
		$scope.search = search;

		// Setup main map
		var mainMap = mapFactory();
		var element = document.getElementById('main-map');
		mainMap.init(element).then(function() {
			$scope.isLoading = false;
		});

		function search() {
			return mainMap.search($scope.searchTerm);
		}
	}]);
});
