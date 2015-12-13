define(function() {

	return function(map, directionsService, directionsDisplay, origin, destination) {
		directionsService.route({
			origin: origin,
			destination: destination,
			travelMode: google.maps.TravelMode.DRIVING
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setMap(map);
				directionsDisplay.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	};

});
