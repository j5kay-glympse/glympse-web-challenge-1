define(function() {
	'use strict';

	function handleLocationError(browserHasGeolocation, marker, pos) {
		marker.setPosition(pos);
		window.alert(browserHasGeolocation ?
			'Error: The Geolocation service failed.' :
			'Error: Your browser doesn\'t support geolocation.');
	}

	return function(map, marker) {
		// Try HTML5 geolocation.

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				marker.setPosition(pos);
				marker.setMap(map);
				map.panTo(pos);
				console.log("User Marker", marker);
			}, function() {
				handleLocationError(true, marker, map.getCenter());
			});
		} else {
			// Browser doesn't support Geolocation
			handleLocationError(false, marker, map.getCenter());
		}

	};

});
