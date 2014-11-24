/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var $       = require('jquery'),
        angular = require('angular');

    exports.$ = $;

    
    // delay initialization so that the map is ready
    // via http://stackoverflow.com/questions/16286605/ \
    // initialize-angularjs-service-with-asynchronous-data
    
    $(function() {

        require('mapApp'); 
        angular.bootstrap(document, ['mapApp']); 
        
    });
});
