
define(function(require, exports, module) {
	'use strict';

	// Import Dependencies
	var $ = require('jquery'),
		_mapbox = require('mapbox'), L = _mapbox;

	// Card View Constructor
	function Card(options) {
		// Broadcast what we're doing
		console.info('Initializing Card:', options);

		if (!('feature' in options)) {
			console.error('Attempting to render an invalid card ..');
			return;
		}

		// Setup context information for card
		this._feature = options.feature;
		this._map = options.map;
		this._marker = new L.marker([
			this._feature.geometry.coordinates[1],
			this._feature.geometry.coordinates[0]
		]);


		// Set options
		this._options = options;
	}

	Card.prototype.render = function() {
		var $index = $('#' + this._options.indexId),
			$card = $('<div>'),
			title = this._options.feature.text,
			address = this._options.feature.properties.address;

		// Setup the card layout. Normally this would be done via templating
		$card.html('<span class="title">' + title + '</span><span class="address">' + address + '</span>');

		// Push the card into the parent container ..
		$index.find('.result').append($card);

		// Push the card's marker onto the map.
		this._marker.addTo(this._map);
	};

	Card.prototype.methodTemplate = function() {
		// ..
	};

	return Card;
});
