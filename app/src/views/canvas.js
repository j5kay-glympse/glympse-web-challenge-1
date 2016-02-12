
define(function(require, exports, module) {
	'use strict';

	// Import Dependencies
	var $ = require('jquery'),
		_mapbox = require('mapbox'), L = _mapbox,
		Card = require('src/views/card.js');

	// Canvas View Constructor
	// Note: Normally, we would abstract the interface by which we create and
	//   communicate with the actual map control.
	function Canvas(options) {
		// Broadcast what we're doing
		console.info('Initializing Canvas:', options);

		this._ready = false;

		// Setup the Mapbox token
		if (!('mapboxToken' in options)) {
			console.error('You need to provide an access token to get this going ..');
			return;
		}

		// Setup the Mapbox access token
		L.mapbox.accessToken = this.accessToken = options.mapboxToken; // Demo / Examples Key

		// Setup Mapbox API locations
		this._geocoderUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
		
		// Create the map instance
		this._map = L.mapbox.map(options.mapId || 'map', 'mapbox.streets'); // Demo / Examples Tile Set

		// Set default geo options
		if (!('geo' in options)) {
			options.geo = {};
		}

		// Set default latLng options
		if (!('latLng' in options)) {
			options.latLng = [47.530101099999996, -122.03261909999999]; // Default location for time ..
		}

		// Set default zoomLvl option
		if (!('zoomLvl' in options)) {
			options.zoomLvl = 13;
		}

		// Set default zoomLvl option
		if (!('indexId' in options)) {
			options.indexId = 'index';
		}

		this._options = options;
		this._results = [];
		this._ready = true;
	}

	Canvas.prototype.render = function() {
		// Broadcast what we're doing
		console.info('Rendering Canvas');

		if (!this._ready) {
			console.error('The canvas isn\'t ready to render');
			return;
		}

		// Set zoom level from default
		this.zoomLvl = this._options.zoomLvl;
		
		// Set the current Map's view
		if (!('latLng' in this._options)) {
			// We don't know what point to center yet, so we'll get the user's
			// current position and set center to the returned lat / lng
			// Note: In the "real-world" we would check for `navigator` support
			//   and show a friendly message to the user if we can't access it
			navigator.geolocation.getCurrentPosition(
				this.setCurrentPosition.bind(this),
				this.errCurrentPosition.bind(this),
				this._options.geo
			);
		} else {
			// If we already know what center we want to set, use that instead
			// by passing expected coord obj struct to `setCurrentPostion`
			this.setCurrentPosition({
				coords: {
					latitude: this._options.latLng[0],
					longitude: this._options.latLng[1]
				}
			});
		}

		// Attach a listener to the search form
		$('.search').on('submit', 'form', this.submitSearchForm.bind(this));
	};

	Canvas.prototype.renderCurrentPosition = function() {
		// Broadcast what we're doing
		console.info('Setting current position to:', this.latLng, this.zoomLvl);
		this._map.setView(this.latLng, this.zoomLvl);
	};

	Canvas.prototype.setCurrentPosition = function(pos) {
		this.latLng = [pos.coords.latitude, pos.coords.longitude];
		this.renderCurrentPosition();
	};

	Canvas.prototype.errCurrentPosition = function(err) {
		// Broadcast what we're doing
		console.error('Could not set position using navigator:', err.message);
	};

	Canvas.prototype.submitSearchForm = function(ev) {
		// Broadcast what we're doing
		console.info('Searching for a POI ..');
		ev.preventDefault();

		var $form = $(ev.currentTarget),
			$input = $form.find('input[name="query"]'),
			query = $input.val(); // In the real-world, we would sanitize this

		// Clear previous results ..
		this.clearResultIndex();

		// Setup the search
		var search = $.ajax(this.getQueryUrl(query));

		// Was the search successful?
		search.success(this.poiSearchSuccess.bind(this));
	};

	Canvas.prototype.getQueryUrl = function(query) {
		var url = this._geocoderUrl,
			bounds = [];
		
		var filter = [
			'access_token=' + this.accessToken
		];

		return url + query + '.json?' + filter.join('&amp;');
	};

	Canvas.prototype.poiSearchSuccess = function(data, status, xhr) {
		// What's going on here?
		console.log('Successfully queried for points of interest ..', data);

		// Iterate the results and create cards for them ..
		for (var i = 0; i < data.features.length; i++) {
			this.addResultCard(data.features[i]);
		}
	};

	Canvas.prototype.clearResultIndex = function() {
		var $results = $('#index .result');
		$results.html('');
		this._results = [];
	};

	Canvas.prototype.addResultCard = function(feature) {
		var card = new Card({
			feature: feature,
			map: this._map,
			indexId: this._options.indexId
		});

		card.render();
		
		this._results.push(card);
	};

	Canvas.prototype.methodTemplate = function() {
		// ..
	};

	return Canvas;
});
