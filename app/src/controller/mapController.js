define(['gMaps', 'service/toastService', 'q', 'jquery'], function(gMaps, toastService, q, $) {

	var _flags = {
		hasGeoLocation: false,
		pixelRatio: 'normal'
	};
	var _map;
	var _dirRenderer;
	var _geoCoder;
	var _user = {
		currentPosition: null,
		marker: null
	};
	var _result ={
		searchString: '',
		data: {
			search: {},
			poi: []
		},
		markers: {
			search: null,
			poi: []
		}
	};
	var _asset = {};
	var _elements = {};
	var _currentView;
	var _const = {
		view:{
			map: 'map',
			resultsList: 'resultsList'
		}
	};
	var _currentlySelectedResult;
	var _resizeTimeout;



	function init() {
		//Get sprites so we never ever have to manually update that stuff. Thanks spritesmith!
		var deferredMarkerSprite = q.defer();

		_elements.googleMap = $('[data-application-map]');
		_elements.mapWrapper = $('.mapWrapper');
		_elements.locationEntry = $('[data-map-location-entry]');
		_elements.locationEntryToggle = _elements.locationEntry.find('.toggle');
		_elements.resultsList = $('[data-results-list]');
		_elements.resultsListWrapper = _elements.resultsList.closest('.resultsListWrapper');
		_elements.resultsListTitle = _elements.resultsListWrapper.find('h2');

		//Get map sprites
		$.ajax({
			dataType: 'json',
			url: './data/sprite-marker.json',
			success: function(data) {
				_onMarkerSpriteLoad(data, deferredMarkerSprite);
			}
		});

		_setPixelRatio();
		_clearResults();
		_updateCurrentView();

		//Why am I using promises? Because, it'll be extensible later on when we decide to add more sprites.
		deferredMarkerSprite.promise.then(_initMap);

		_elements.locationEntryToggle.on('click', _toggleLocEntry);
		_elements.locationEntry.on('submit', _onLocationSubmit);
		_elements.resultsList.on('click', 'li', _onPOISelect);
		$(window).on('resize', _onResize);
	}



	function _initMap() {
		_map = new gMaps.Map(
			_elements.googleMap.get(0),
			{
				center: {lat: 47.6204, lng: -122.349355},
				zoom: 14
			}
		);

		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(_firstPositionRetrieval);
			_flags.hasGeoLocation = true;
			//TODO: Show map waiting for location
		}

		window.setInterval(_updateUserLocation, 3000);
	}



	function _updateUserLocation(){
		navigator.geolocation.getCurrentPosition(_onLocationUpdate);
	}



	/**
	 * As the location updates come in, this updates the map.
	 *
	 * @param geoPos    {object}    The geo position object returned by navigator.geolocation.getCurrentPosition()
	 *
	 * @private
	 */
	function _onLocationUpdate(geoPos){
		//Note, you could/should (prolly) be doing some error checking here.
		_user.currentPosition = new gMaps.LatLng(parseFloat(geoPos.coords.latitude), parseFloat(geoPos.coords.longitude));
		_user.marker.setPosition(_user.currentPosition);
	}



	function _onLocationSubmit(e){
		e.preventDefault();
		var location = _elements.locationEntry.find('input').val();
		var bounds = _map.getBounds();
		var sw = bounds.getSouthWest();
		var ne = bounds.getNorthEast();
		var latLngBounds = {
			north: ne.lat(),
			east: ne.lng(),
			south: sw.lat(),
			west: sw.lng()
		};

		_toggleLocEntry();
		_result.searchString = location;
		_clearResults();
		_geoCoder = _geoCoder || new gMaps.Geocoder();
		_geoCoder.geocode({'address': location, bounds: latLngBounds}, _onGeocodeResponse);
	}



	function _onGeocodeResponse(data){
		if (Array.isArray(data) && data.length){
			//Since I'm slightly unclear on requirements, I'm just grabbing the first item returned, and pulling POIs
			//from that.
			var loc = data[0];
			var pos;

			if (loc.geometry && loc.geometry.location){
				pos = new gMaps.LatLng(loc.geometry.location.lat(), loc.geometry.location.lng());
				_map.panTo(pos);

				_result.markers.search = _dropMarker(pos, _asset.markerSprite.searchResultMarker);
				_result.data.search = loc;
				_queryPOI(pos);
			}
		}
	}



	function _queryPOI(location){
		var request = {
			location: location,
			radius: '1000',
			types: ['school', 'restaurant', 'park']
		};
		var service = new gMaps.places.PlacesService(_map);
		function randomMarker(location, asset, index) {
			window.setTimeout(function() {
				_result.markers.poi[index] = _dropMarker(location, asset);
			}, Math.random() * 1000);
		}

		service.nearbySearch(request, function(results, status) {
			if (status == gMaps.places.PlacesServiceStatus.OK){
				for (var i = 0; i < results.length; i++) {
					var spr = _getResultIcon(results[i]);
					var types = results[i].types;

					if (types.indexOf('restaurant') !== -1 || types.indexOf('bar') !== -1 || types.indexOf('food') !== -1){
						results[i].cssClass = 'restaurant';
					}
					else if (types.indexOf('school') !== -1){
						results[i].cssClass = 'school';
					}
					else if (types.indexOf('park') !== -1){
						results[i].cssClass = 'park';
					}

					//Randomize the drop to have a cool effect instead of just a bunch of pins dropping at once :)
					randomMarker(results[i].geometry.location, spr, i);
				}
				_result.data.poi = results;
				_currentView = _const.view.resultsList;
				_onPOIDataUpdate();
				_updateCurrentView();
			}
		});
	}



	function _onPOIDataUpdate(){
		for (var i = 0; i < _result.data.poi.length; i++) {
			var poi = _result.data.poi[i];
			_elements.resultsList.append($('<li class="' + poi.cssClass + '"><span class="icon"></span>' + poi.name + '</li>'));
			_elements.resultsListTitle.html('POIs near ' + _result.searchString);
		}
	}



	function _onPOISelect(){
		var i = $(this).index();
		var data = _result.data.poi[i];
		var marker = _result.markers.poi[i];
		var icon = _getResultIcon(data, true);
		var dirReqObj = {
			origin: _user.currentPosition,
			destination: data.geometry.location,
			travelMode: gMaps.TravelMode.DRIVING
		};
		var dirService = new gMaps.DirectionsService();
		_deselectCurrentResult();
		_currentlySelectedResult = i;
		marker.setOptions({
			icon: _parseMarkerImage(icon)
		});
		dirService.route(dirReqObj, _onRouteReceived);
		_currentView = _const.view.map;
		_updateCurrentView();
	}



	function _onRouteReceived(route){
		_dirRenderer = _dirRenderer || new gMaps.DirectionsRenderer({
			map: _map
		});
		_dirRenderer.setDirections(route);
	}



	function _deselectCurrentResult(){
		var data = _result.data.poi[_currentlySelectedResult];
		var marker = _result.markers.poi[_currentlySelectedResult];
		if (marker) {
			marker.setOptions({
				icon: _parseMarkerImage(_getResultIcon(data))
			});
		}
		_currentlySelectedResult = null;
	}



	function _getResultIcon(result, selected) {
		var types = result.types;
		var spr = _asset.markerSprite;
		if (types.indexOf('restaurant') !== -1 || types.indexOf('bar') !== -1 || types.indexOf('food') !== -1) {
			return selected ? spr.restaurantSelectedMarker : spr.restaurantMarker;
		}
		else if (types.indexOf('school') !== -1) {
			return selected ? spr.schoolSelectedMarker: spr.schoolMarker;
		}
		else if (types.indexOf('park') !== -1) {
			return selected ? spr.parkSelectedMarker : spr.parkMarker;
		}
		else {
			return selected ? spr.poiSelectedMarker : spr.poiMarker;
		}
	}



	function _dropMarker(position, icon){
		return new gMaps.Marker({
			map: _map,
			animation: gMaps.Animation.DROP,
			position: position,
			icon: _parseMarkerImage(icon),
			optimized: false
		});
	}



	/**
	 * Clear all results and their markers
	 *
	 * @private
	 */
	function _clearResults(){
		try {
			for (var i = 0; i < _result.markers.poi.length; i++) {
				var marker = _result.markers.poi[i];
				marker.setMap(null);
				_elements.resultsList.html('');
			}
			_result.markers.search.setMap(null);
			_result.data = {
				search: {},
				poi: []
			};
			_result.markers.poi = [];
			_result.markers.search = null;
			_deselectCurrentResult();
		}
		catch (e){}
	}



	function _toggleLocEntry(){
		_elements.locationEntry.toggleClass('active');
	}



	/**
	 * Fires when the marker sprite has finished loading.
	 *
	 * @param data
	 *
	 * @param promise
	 *
	 * @private
	 */
	function _onMarkerSpriteLoad(data, promise) {
		_asset.markerSprite = data;
		promise.resolve();
	}



	/**
	 * First-run position retrieval should set up user location, etc.
	 *
	 * @param geoPos    {object}    The geo position object returned by navigator.geolocation.getCurrentPosition()
	 *
	 * @private
	 */
	function _firstPositionRetrieval(geoPos) {
		var html = $('<div></div>');
		var hasHtml = false;
		if (geoPos.coords.accuracy){
			html.append($('<p>Location accurate to ~' + Math.round(geoPos.coords.accuracy) + ' meters.</p>'));
			hasHtml = true;
		}
		if (geoPos.coords.altitude){
			html.append($('<p>Your altitude is ~' + Math.round(geoPos.coords.altitude) + ' meters above sea level.</p>'));
			hasHtml = true;
		}
		if (geoPos.coords.heading){
			html.append($('<p>Your heading is presently ~' + Math.round(geoPos.coords.heading) + ' degrees.</p>'));
			hasHtml = true;
		}
		if (hasHtml){
			toastService.showToast(html);
		}

		//Note, you could/should (prolly) be doing some error checking here.
		_user.currentPosition = new gMaps.LatLng(parseFloat(geoPos.coords.latitude), parseFloat(geoPos.coords.longitude));
		_map.panTo(_user.currentPosition);

		_user.marker = _dropMarker(_user.currentPosition, _asset.markerSprite.userMarker);
	}



	/**
	 * Determine whether to use 1x or 2x sprite images.
	 *
	 * @private
	 */
	function _setPixelRatio() {
		if ('devicePixelRatio' in window) {
			_flags.pixelRatio = window.devicePixelRatio > 1 ? 'retina' : 'normal';
		}
		else {
			_flags.pixelRatio = 'normal';
		}
	}



	/**
	 * Switch between views in the UI
	 *
	 * @private
	 */
	function _updateCurrentView(){
		switch (_currentView){
			case _const.view.resultsList:
				_elements.mapWrapper.removeClass('active');
				_elements.resultsListWrapper.addClass('active');
				break;
			default:
				//Default to map view
				_elements.mapWrapper.addClass('active');
				_elements.resultsListWrapper.removeClass('active');
				break;
		}
	}



	/**
	 * Gets a sprite as either a retina or normal size image
	 *
	 * @param obj   {object}    A JSON node from the sprite JSON file containing pertinent data to the specified marker
	 *
	 * @returns {{url: (*|string|boolean|string), size: google.maps.Size, scaledSize: google.maps.Size, origin: google.maps.Point, anchor: google.maps.Point}}
	 *
	 * @private
	 */
	function _parseMarkerImage(obj) {
		var normal = obj.normal;
		return {
			url: obj[_flags.pixelRatio].image,
			size: new gMaps.Size(normal.width, normal.height),
			scaledSize: new gMaps.Size(normal.total_width, normal.total_height),
			origin: new gMaps.Point(Math.abs(normal.offset_x), Math.abs(normal.offset_y))
		};
	}



	function _onResize(){
		if (_resizeTimeout){
			window.clearTimeout(_resizeTimeout);
		}
		_resizeTimeout = window.setTimeout(function() {
			_map.panTo(_user.currentPosition);
		}, 150);
	}



	return {
		init: init
	};
});
