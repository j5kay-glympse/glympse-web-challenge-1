/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var $ = require('jquery');

	console.log('Map Challenge! - size=' + $(document).width() + 'x' + $(document).height());
	
	var map, mapContainer, userLoc, infowindow, placesService, directionsService, directionsDisplay;
	var placemarkers = []; 
	var places = [];
	
	var GoogleMapsLoader = require('google-maps');
	GoogleMapsLoader.LIBRARIES = ['places'];
	GoogleMapsLoader.KEY = 'AIzaSyCvmdPIDxTI_gJVBaHhWl61M7pqKc516Bo';
	
	mapContainer = document.getElementById('map');
	mapContainer.innerHTML = '<p>Locating…</p>';
    
	
    GoogleMapsLoader.load(function(google) {
		console.log('google loader load');  
		if (!navigator.geolocation){
			mapContainer.innerHTML = 'Geolocation is not supported by your browser';
			return;
		}
		navigator.geolocation.getCurrentPosition(geolocSuccess, geolocError);
		map = new google.maps.Map(mapContainer, {
			center:  { lat: 47.6097, lng: -122.3331},
			zoom: 13
		});
		
		placesService = new google.maps.places.PlacesService(map);
		directionsService = new google.maps.DirectionsService(map);
		infowindow = new google.maps.InfoWindow();
		directionsDisplay = new google.maps.DirectionsRenderer();
		map.addListener('bounds_changed', function() {   
		});

  
	
	function geolocSuccess(position) {
		$('.modal.overlay').fadeOut('fast');
		userLoc = {lat: position.coords.latitude, lng: position.coords.longitude};
		console.log('Latitude: ' + userLoc.lat + ' Longitude: ' + userLoc.lng);
		var marker = new google.maps.Marker({
            position: userLoc,
            map: map,
			label:'U'
		});
		map.panTo(marker.getPosition());
    }

    function geolocError() {
        mapContainer.innerHTML = 'Unable to retrieve your location';
    }
    
	function resetMap(){
		map.setCenter(userLoc);
		map.setZoom(13);
	}
	function processPlacesResults(results, status) {
		deletePlaceMarkers();
		places = results;
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
		if (places.length > 0) {
            //Hide List Button
			$('#search-list-panel button').show();
		}
		setPlacesOnMap(map);
    }

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });
		placemarkers.push(marker);
		
        var listItem;
		var listItemContent = formatPlaceInfo(place);
		listItem = '<li id="place-' + place.id + '">' + listItemContent + '</li>';
		$('#list-panel ul').append(listItem);
		$('#list-panel ul li').last().click(function() {
			getDirectionsTo(place);
			$('#list-toggle').click();
		});
		
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(listItemContent);
            infowindow.open(map, this);
			$('.directions a').click(function() {
				getDirectionsTo(place);
			});
        });
    }
	function formatPlaceInfo(place){
		return '<div class="name">' + place.name + '</div>' +
		'<div class="address">' + place.formatted_address + 
		'</div><div class="directions"><button>Get Directions</button></div>';	
	}
	
	function setPlacesOnMap(map) {
		for (var i = 0; i < placemarkers.length; i++) {
			placemarkers[i].setMap(map);
		}
	}
	
	function clearMarkers() {
        //Clears Map
		setPlacesOnMap(null);
		//Clears list
		$('#list-panel ul').html('');
		//Hide List Button
		$('#search-list-panel button').hide();
	}

	// Deletes all markers in the array by removing references to them.
	function deletePlaceMarkers() {
		clearMarkers();
		placemarkers = [];
	}
	
	function getDirectionsTo(place){
		var directionsMap = new google.maps.Map(document.getElementById('directions-map'), {
			center: userLoc,
			zoom: 13
		});
		
		directionsDisplay.setMap(directionsMap);
		directionsDisplay.setPanel(document.getElementById('directions-list'));
		var directionsRequest = {
              origin: userLoc,
              destination: place.geometry.location,
              travelMode: google.maps.TravelMode.DRIVING
        };
		directionsService.route(directionsRequest, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } 
            else {
                console.log('Directions request failed:' + status);
			}
          });
          $('#directions').show();
	}
	$('#directions .close').click(function(){
		var d = $('#directions');
		d.hide();
		d.children('section').html('');
	});
	$('#searchbox').keyup(function() {
		var val  = $('#searchbox').val();
		if (val != '') {
			var request = {
				bounds: map.getBounds(),
				query:$('#searchbox').val()
			};
			placesService.textSearch(request,processPlacesResults);
		}
		else {
			deletePlaceMarkers();
		}
	});
	
	
	
	$('#list-toggle').click(function() {
		$('#list-panel').slideToggle('fast', function() {
			if ($('#list-panel').is(':visible')) {
				$('#list-toggle').text('Map');
				$('#search-list-panel').addClass('open');
			}
			else {
				$('#list-toggle').text('List');
				$('#search-list-panel').removeClass('open');
			}
		});
	});
	
    });
});
