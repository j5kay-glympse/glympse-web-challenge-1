/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var $ = require('jquery');

    require(['async', 'config', 'angular'], function(async, config, angular) {

        require(['async!http://maps.google.com/maps/api/js?key=' + config.MAP_KEY], function() {
          
            var mapOptions = {
              center: { lat: -34.397, lng: 150.644 },
              zoom: 8
            };
            var map = new google.maps.Map(document.getElementById('map'), mapOptions);

        });
    });
});
