/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var $ = require('jquery');
    var ng = require('angular');
    console.log(ng.merge({}, {test: 'big'}));

	console.log('Map Challenge! - size=' + $(document).width() + 'x' + $(document).height());
});
