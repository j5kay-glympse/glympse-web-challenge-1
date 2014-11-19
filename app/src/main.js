/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var $ = require('jquery');

    exports.$ = $;

    require(['async', 'config'], function(async, config) {

        var reqUrl = 'async!' +
                  'http://maps.google.com/maps/api/js?libraries=places&key=' +
                  config.MAP_KEY;

        require([reqUrl], function() {
            
            var map = new google.maps.Map(
                document.getElementById('map'), config.MAP_OPTS);

            
            // forgot that the app shouldn't bootstrap immediately or else the 
            // dependency won't exist.
            // via http://stackoverflow.com/questions/16286605/ \
            // initialize-angularjs-service-with-asynchronous-data

            angular.module('myMap', []).value('gMap', map).value('google', google);

            $(function() {
                angular.bootstrap(document, ['mapApp']);
            });
        });
    });
});
