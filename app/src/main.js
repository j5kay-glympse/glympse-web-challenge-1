/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var $      = require('jquery'),
        async  = require('async'),
        config = require('config'),
        angular = require('angular');

    exports.$ = $;
    
    
    var reqUrl = 'async!' +
                 'http://maps.google.com/maps/api/js?libraries=places&key=' +
                 config.MAP_KEY;

    // The object 'google' isn't returned when requiring the asynchronous map
    // url. But window.google does exist
    require([reqUrl], function(undefined) {
       
        
        var map = new google.maps.Map(
            document.getElementById('map'), config.MAP_OPTS);
        

        // setup our map app's dependency on the map module

        angular.module('map', []).value('gMap', map).value('google', google);

        require('mapApp');


        // forgot that the app shouldn't bootstrap immediately or else the 
        // dependency won't exist.
        // via http://stackoverflow.com/questions/16286605/ \
        // initialize-angularjs-service-with-asynchronous-data
        
        $(function() {
            angular.bootstrap(document, ['mapApp']);
        });
    });
});
