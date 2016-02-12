/* globals define */
define(function(require, exports, module) {
	'use strict';

	// Import Dependencies
	var $ = require('jquery'),
		Canvas = require('src/views/canvas.js');

	// Say the thing!
	console.log('Map Challenge! - size=' + $(document).width() + 'x' + $(document).height());

	// Initialize & Render Canvas View
	var _canvas = new Canvas({
		mapId: 'map',
		indexId: 'index',
		mapboxToken: 'pk.eyJ1IjoiZnVydnIiLCJhIjoiZ1dOWi0xMCJ9.s1Bpv_0f3yhdnWY_M0rjeA'
	});
	
	_canvas.render();
});
