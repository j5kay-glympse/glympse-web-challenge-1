/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var $ = require('jquery');

    console.log('Map Challenge! - size=' + $(document).width() + 'x' + $(document).height());

    var GoogleMapsLoader = require('google-maps');

    GoogleMapsLoader.KEY = 'AIzaSyA1X7v2Gd2fmv1VV7Lbg71JbW7OT4Whn9E';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

	GoogleMapsLoader.load(function(google) {
	    var map, mapCanvas, mapOptions, curLocMarker, placesService, infoWindow, searchMarkers, trafficLayer, directionsRenderer, directionsService;

	    if (!navigator.geolocation) {
	        console.log('geolocation not available')
            return;
        }

        mapCanvas = document.getElementById('map');
        mapOptions = {
	  		center: new google.maps.LatLng(-34.397, 150.644),
	  		zoom: 13,
	  		mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				position: google.maps.ControlPosition.TOP_RIGHT,
				mapTypeIds: [
					google.maps.MapTypeId.ROADMAP,
					google.maps.MapTypeId.TERRAIN,
					google.maps.MapTypeId.SATELLITE,
					google.maps.MapTypeId.HYBRID
				]
	  		},
	  		zoomControlOptions: {
				position: google.maps.ControlPosition.LEFT_BOTTOM
			},
			streetViewControlOptions: {
				position: google.maps.ControlPosition.LEFT_BOTTOM
			}

        }

        map = new google.maps.Map(mapCanvas, mapOptions);
        directionsRenderer = new google.maps.DirectionsRenderer();
		directionsService = new google.maps.DirectionsService();
        placesService = new google.maps.places.PlacesService(map);
        infoWindow = new google.maps.InfoWindow();
        searchMarkers = new Array();
        trafficLayer = new google.maps.TrafficLayer();

        navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionFailure);

        function getPositionSuccess(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
		 	};

		 	curLocMarker = new google.maps.Marker({
				position: pos,
				map: map,
				title: 'current location',
				icon: "../content/images/marker.png"
			});

		    map.setCenter(pos);

		    curLocMarker.addListener('click', function() {
				map.setZoom(15);
				map.setCenter(curLocMarker.getPosition());
			});
        }

        function getPositionFailure() {
			console.log('ERR: failed to get current position')
		}

		function createMarker(place) {
          	var placeLoc = place.geometry.location;
          	var marker = new google.maps.Marker({
				map: map,
				position: place.geometry.location
          	});

          	searchMarkers.push(marker);

          	var listItemContent = formatPlaceDataForList(place);
          	var listItem = '<li id="place-' + place.id + '">' + listItemContent + '</li>';
			$('#list-section ul').append(listItem);
			$('#list-section ul li').last().click(function() {
				$('#list-section ul li').removeClass('selected');
				$(this).addClass('selected');
				//requestDirections(place);
			});

          	google.maps.event.addListener(marker, 'click', function() {
            	infoWindow.setContent(place.name);
            	infoWindow.open(map, this);
          	});
        }

		function formatPlaceDataForList(place){
			var distAway = google.maps.geometry.spherical.computeDistanceBetween (curLocMarker.position, place.geometry.location);
			distAway = (distAway * 0.000621371192).toFixed(2); //convert meters to miles and round to 2 decimal places
			var regExp = new RegExp('_', 'g');
			var placeType = place.types[0].replace(regExp, ' ');

			return '<div class="info-panel"><div class="name">' + place.name + '</div>' +
			'<div class="address">' + place.formatted_address + '</div>' +
			'<div class="place-type">' + placeType + '</div>' +
			'<div class="distance-away"> Dist. Away: ' + distAway + ' miles</div></div>' +
			'<button class="directions-button round-button"></div>';
		}

		function requestDirections(place) {
			//reset directions
			directionsRenderer.setMap(null);

		}

		function textSearchCallback(results, status) {
        	if (status === google.maps.places.PlacesServiceStatus.OK) {
            	for (var i = 0; i < results.length; i++) {
              		createMarker(results[i]);
            	}

            	setMarkersOnMap(map);
          	}
        }

        function setMarkersOnMap(map) {
			for (var i = 0; i < searchMarkers.length; i++) {
				searchMarkers[i].setMap(map);
			}
		}

		function clearMarkers() {
			//Clears Map
			setMarkersOnMap(null);
		}

		function deletePlaceMarkers() {
			clearMarkers();
			searchMarkers = [];
		}

		function openSearchPanel(){
			var searchPanel = $('#search-panel');
			if (searchPanel.hasClass('open')) {
				searchPanel.animate({ height:'0'}, 'fast', function() {
					searchPanel.removeClass('open');
				});
			}
			else {
				searchPanel.animate({ height:'60px'}, 'fast', function() {
					searchPanel.addClass('open');
					$('#search-input').focus();
				});
			}
		}

		function toggleTrafficLayer() {
			if (trafficLayer.getMap() != null) {
				$('#traffic-button').removeClass('enabled');
				trafficLayer.setMap(null);
			}
			else {
			$('#traffic-button').addClass('enabled');
				trafficLayer.setMap(map);
			}

		}

		function toggleDisplayType() {
			var mainContainer = $('#main-container');
			var listSection = $('#list-section');
			var displayTypeButton = $('#display-type-button');

			if (mainContainer.data('view-type') == 'map') {
				mainContainer.data('view-type', 'list')
				listSection.animate({ width:'100%'}, 'fast', function() {
					listSection.addClass('open');
					displayTypeButton.addClass('map-button');
					displayTypeButton.removeClass('list-button');
					displayTypeButton.text('MAP');
				});
			}
			else {
				mainContainer.data('view-type', 'map')
				listSection.animate({ width:'0'}, 'fast', function() {
					listSection.removeClass('open');
					displayTypeButton.addClass('list-button');
					displayTypeButton.removeClass('map-button');
					displayTypeButton.text('LIST');
				});
			}
		}

        $('#search-button').click(function() {
        	openSearchPanel();
        });

        $('#search-input').keyup(function() {
        	var searchQuery = $('#search-input').val();

			if (searchQuery != '') {
				var request = {
					bounds: map.getBounds(),
					query: searchQuery
				};

				placesService.textSearch(request,textSearchCallback);
			}
        });

        $('#traffic-button').click(function() {
			toggleTrafficLayer();
		});

		$('#display-type-button').click(function() {
			toggleDisplayType();
		});

    });

    GoogleMapsLoader.onLoad(function(google) {
        console.log('I just loaded google maps api');
    });

//    GoogleMapsLoader.release(function() {
//        console.log('No google maps api around');
//    });
});
