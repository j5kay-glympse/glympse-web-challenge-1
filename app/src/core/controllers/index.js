define(function(require) {
	'use strict';
	var app = require('./../module');

	app.controller('indexCtrl', ['$scope', 'map', function($scope, map) {
		$scope.content = 'testing index';
	}]);
});
