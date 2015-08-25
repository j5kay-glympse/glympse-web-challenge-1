/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var $ = require('jquery');

	console.log('Map Challenge! - size=' + $(document).width() + 'x' + $(document).height());
	
	var GoogleMapsLoader = require('google-maps');
	GoogleMapsLoader.LIBRARIES = ['places'];
	GoogleMapsLoader.KEY = 'AIzaSyCvmdPIDxTI_gJVBaHhWl61M7pqKc516Bo';
    
	GoogleMapsLoader.load(function(google) {
		var map, mapContainer, userLoc, infowindow, placesService, leftPanel;
		var placemarkers = []; 
		var places = [];	
		mapContainer = document.getElementById('map');
		leftPanel = document.getElementById('leftPanel');
		//Get User Location
		if (!navigator.geolocation){
			mapContainer.innerHTML = 'Geolocation is not supported by your browser';
			return;
		}
		navigator.geolocation.getCurrentPosition(geolocSuccess, geolocError);
		map = new google.maps.Map(mapContainer, {
			center:  { lat: 47.6097, lng: -122.3331},
			zoom: 13
		});
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var directionsService = new google.maps.DirectionsService();
		placesService = new google.maps.places.PlacesService(map);
		infowindow = new google.maps.InfoWindow();
	
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
		infowindow.setContent('<strong>You</strong><br> Accuracy: ' + position.coords.accuracy + 'm');
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, marker);
		});
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
                createMarker(i);
            }
        }
		if (places.length > 0) {
            //Hide List Button
			$('#search-list-panel button').show();
		}
		setPlacesOnMap(map);
    }

    function createMarker(i) {
		var place = places[i];
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
			$('#list-panel ul li').removeClass('selected');
			$(this).addClass('selected');
			getDirectionsTo(place);
		});
		
		
        google.maps.event.addListener(marker, 'click', function() {
            var e = '#list-panel ul li:nth-child(' + (i + 1) +')';
			openLeftPanel();
			
			$('#list-panel').animate({scrollTop: $(e).offset().top
			}, 1000, function() {
				$(e).click();
			});

        });
    }
	function formatPlaceInfo(place){
		return '<div class="name">' + place.name + '</div>' +
		'<div class="address">' + place.formatted_address + '</div>' +
		'<div>' + place.types[0] +'</div>' +
		'</div><div class="directions"></div>';	
	}
	
	function setPlacesOnMap(map) {
		for (var i = 0; i < placemarkers.length; i++) {
			placemarkers[i].setMap(map);
		}
	}
	
	function clearMarkers() {
        //Clears Map
		setPlacesOnMap(null);
	}

	// Deletes all markers in the array by removing references to them.
	function deletePlaceMarkers() {
		clearMarkers();
		placemarkers = [];
		//Clears list
		$('#list-panel ul').html('');
		//Hide List Button
		$('#search-list-panel button').hide();
	}
	
	function getDirectionsTo(place){
	
		directionsDisplay.setMap(null);
		
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
		directionsDisplay.setMap(map);
		setPlacesOnMap(null);
	}
	function openLeftPanel(){
		$('#left-panel').animate({ width:'300px'},'fast', function() {
			$('#left-panel').addClass('open');
			$('#list-toggle').text('-');
		});
	}
	
	$('#searchbox').keyup(function() {
		var val  = $('#searchbox').val();
		directionsDisplay.setMap(null);
		resetMap();
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
		var p = $('#left-panel');
		if ($(p).hasClass('open')) {
			$(p).animate({ width:'0'},'fast', function() {
				$(p).removeClass('open');
				$('#list-panel ul li').removeClass('selected');
				$('#list-toggle').text('+');
				setPlacesOnMap(map);
				resetMap();
			});
		}
		else {
			openLeftPanel();
		}
	});
	
	});//GoogleLoader func
	
});
