define(function(require) {
	'use strict';
	var app = require('./module');

	require('tpl!./index.html');

	return app.config(['$stateProvider','$httpProvider', function($stateProvider, $httpProvider) {
		//httpProvider settings
		$httpProvider.defaults.withCredentials = true;
		$httpProvider.defaults.useXDomain = true;

		//Routes
		$stateProvider
			.state('index', {
				url: '',
				templateUrl: 'core/index.html',
				controller: 'indexCtrl'
			});
	}]);
});
