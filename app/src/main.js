/* globals define */
define(function(require, exports, module) {
    'use strict';

	// init raf polyfill
	require('famousAnimationFrame');

	// import dependencies
    var $ = require('jquery');

	console.log('Map Challenge! - size=' + $(document).width() + 'x' + $(document).height());
});
