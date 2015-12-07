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
	    var map, mapCanvas, mapOptions, curLocation, curLocMarker, placesService, infoWindow,
	    	searchMarkers, trafficLayer, directionsRenderer, directionsService, selectedPlace;

	    if (!navigator.geolocation) {
	        console.log('geolocation not available')
            return;
        }

        initMap();

        directionsRenderer = new google.maps.DirectionsRenderer();
		directionsService = new google.maps.DirectionsService();
        placesService = new google.maps.places.PlacesService(map);
        infoWindow = new google.maps.InfoWindow();
        searchMarkers = new Array();
        trafficLayer = new google.maps.TrafficLayer();

        navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionFailure);

        function getPositionSuccess(position) {
        	var posCoords = position.coords;
			curLocation = {
				lat: posCoords.latitude,
				lng: posCoords.longitude
		 	};

		 	curLocMarker = new google.maps.Marker({
				position: curLocation,
				map: map,
				title: 'current location',
				icon: "../content/images/marker.png"
			});

		    recenterMapOnCurrentPosition();

			google.maps.event.addListener(curLocMarker, 'click', function() {
				var positionInfo = '<div>Lat: ' + posCoords.latitude + '</div>'
								+ '<div>Lng: ' + posCoords.longitude + '</div>'
								+ '<div>Acc: ' + posCoords.accuracy + '</div>'
								+ '<div>Heading: ' + posCoords.heading + '</div>';
				infoWindow.setContent(positionInfo);
				infoWindow.open(map, this);

				map.setCenter(curLocMarker.getPosition());
			});
        }

        function recenterMapOnCurrentPosition()
        {
        	map.setCenter(curLocation);
        	map.setZoom(13);
        }

        function getPositionFailure() {
			console.log('ERR: failed to get current position')
		}

		function createMarker(place) {
          	var marker = new google.maps.Marker({
				map: map,
				position: place.geometry.location
          	});

          	searchMarkers.push(marker);

			//marker and info window button click events
			google.maps.event.addListener(marker, 'click', function() {
				$(searchMarkers).each(function(){
					this.setLabel(null);
				});
				marker.setLabel('!');

				var infoWindowContent  = '<div class="selected-place"><div class="name">' + place.name + '</div>'
										+ '<button class="directions-button round-button"></div>';

            	infoWindow.setContent(infoWindowContent);
            	infoWindow.open(map, this);

            	selectedPlace = place;

            	var button = $('.selected-place button');
            	button.click(function() {
					requestDirections(selectedPlace);
				});
          	});

          	var listItemContent = formatPlaceDataForList(place);
          	var listItem = '<li id="place-' + place.id + '">' + listItemContent + '</li>';
			$('#list-section ul').append(listItem);

			//search result info panel click event
			$('#list-section ul li .info-panel').last().click(function() {
				$('#list-section ul li').removeClass('selected');
				$(this).parent().addClass('selected');

				centerMapOnSelectedLocation(place, marker);
				selectedPlace = place;
				clearDirections();
				setMarkersOnMap(map);
				toggleDisplayType();
			});

			//search result directions button click event
			$('#list-section ul li button').last().click(function() {
				requestDirections(place);
			});
        }

		function formatPlaceDataForList(place){
			var distAway = google.maps.geometry.spherical.computeDistanceBetween(curLocMarker.position, place.geometry.location);
			distAway = (distAway * 0.000621371192).toFixed(2); //convert meters to miles and round to 2 decimal places
			var regExp = new RegExp('_', 'g');
			var placeType = place.types[0].replace(regExp, ' ');

			return '<div class="info-panel"><div class="name">' + place.name + '</div>' +
				'<div class="address">' + place.formatted_address + '</div>' +
				'<div class="place-type">' + placeType + '</div>' +
				'<div class="distance-away"> Dist. Away: ' + distAway + ' miles</div></div>' +
				'</div><button class="directions-button round-button"/>';
		}

		function requestDirections(place) {
			clearDirections();

			directionsRenderer.setPanel(document.getElementById('directions-panel'));

			var directionsRequest = {
				  origin: curLocation,
				  destination: place.geometry.location,
				  travelMode: google.maps.TravelMode.DRIVING
			};

			directionsService.route(directionsRequest, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					var rendererOptions = {
						markerOptions: {icon: '../content/images/directions-marker.png'}
					}
					directionsRenderer.setOptions(rendererOptions)
					directionsRenderer.setDirections(response);

					$('#direction-list-button').show();
				}
				else {
					console.log('ERR: failed to retrieve directions:' + status);
				}
			});
			directionsRenderer.setMap(map);
			setMarkersOnMap(null);
			setDisplayTypeToMap();
		}

		function centerMapOnSelectedLocation(place, marker) {
			var latLngBounds = new google.maps.LatLngBounds();
			var latLngs = [new google.maps.LatLng(curLocation.lat,curLocation.lng), place.geometry.location];
			for (var i = 0; i < latLngs.length; i++) {
			  //  And increase the bounds to take this point
			  latLngBounds.extend (latLngs[i]);
			}
			map.setCenter(latLngBounds.getCenter());
			map.fitBounds(latLngBounds);

			google.maps.event.trigger( marker, 'click' );
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

		function clearSearchListAndMarkers() {
			setMarkersOnMap(null);
			searchMarkers = [];
			$('#list-section ul').empty();
		}

		function clearDirections() {
			directionsRenderer.setMap(null);
			$('#direction-list-button').hide();
		}

		function openDirectionsPanel(){
			var directionsPanel = $('#directions-panel');
			if (directionsPanel.hasClass('open')) {
				directionsPanel.animate({ height:'0', top:'100%'}, 'fast', function() {
					directionsPanel.removeClass('open');
					$('#direction-list-button').removeClass('open');
				});
			}
			else {
				directionsPanel.animate({ height:'75%', top:'15%'}, 'fast', function() {
					directionsPanel.addClass('open');
					$('#direction-list-button').addClass('open');
				});
			}
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

		function setDisplayTypeToMap() {
			var mainContainer = $('#main-container');
			var listSection = $('#list-section');
			var displayTypeButton = $('#display-type-button');

			mainContainer.data('view-type', 'map')
			listSection.animate({ width:'0'}, 'fast', function() {
				listSection.removeClass('open');
				displayTypeButton.addClass('list-button');
				displayTypeButton.removeClass('map-button');
				displayTypeButton.text('LIST');
			});
		}

		function setDisplayTypeToList() {
			var mainContainer = $('#main-container');
			var listSection = $('#list-section');
			var displayTypeButton = $('#display-type-button');

			mainContainer.data('view-type', 'list')
			listSection.animate({ width:'100%'}, 'fast', function() {
				listSection.addClass('open');
				displayTypeButton.addClass('map-button');
				displayTypeButton.removeClass('list-button');
				displayTypeButton.text('MAP');
			});
		}

		function toggleDisplayType() {
			var mainContainer = $('#main-container');

			if (mainContainer.data('view-type') == 'map') {
				setDisplayTypeToList();
			}
			else {
				setDisplayTypeToMap();
			}
		}

		function initMap() {
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
		}

		$('#direction-list-button').click(function() {
			openDirectionsPanel();
		});

        $('#search-button').click(function() {
        	openSearchPanel();
        });

        $('#search-input').keyup(function() {
        	clearSearchListAndMarkers();
        	clearDirections();
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
