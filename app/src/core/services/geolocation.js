define(function(require) {
	'use strict';

	var module = require('./../module');

	module.service('geolocation', ['$window', 'notification', function($window, notification) {

		var observers = [];
		var isInitialized = false;
		function init() {
			if (!isInitialized) {
				isInitialized = true;
				if ($window.navigator.geolocation) {
					var timeoutVal = 10 * 1000 * 1000;
					$window.navigator.geolocation.watchPosition(
						updatePosition,
						onError,
						{enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 1000}
					);
				}
				else {
					notification.error('Geolocation is not supported by this browser!');
				}
			}
		}

		function updatePosition(data) {
			notifyObservers(data);
		}

		function onError(error) {
			var errors = {
				1: 'Permission denied',
				2: 'Position unavailable',
				3: 'Request timeout'
			};
			notification.error('Error: ' + errors[error.code]);
		}

		function observe(callback) {
			observers.push(callback);
		}

		function notifyObservers(data) {
			observers.forEach(function(callback) {
				callback(data);
			});
		}

		return {
			init: init,
			observe: observe,
			_updatePosition: updatePosition,
			_onError: onError
		};
	}]);
});
