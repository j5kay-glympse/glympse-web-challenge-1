define(function(require) {
	'use strict';
	var app = require('./../module');

	app.controller('indexCtrl', ['$scope', 'mapFactory', function($scope, mapFactory) {
		$scope.isLoading = true;
		var mainMap = mapFactory();

		// TODO: replace with directive
		var element = document.getElementById('main-map');
		mainMap.init(element).then(function() {
			$scope.isLoading = false;
		});
	}]);
});
