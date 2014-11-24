/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var $       = require('jquery'),
        angular = require('angular');

    exports.$ = $;
    
    require('mapApp');

    // forgot that the app shouldn't bootstrap immediately or else the 
    // dependency won't exist.
    // via http://stackoverflow.com/questions/16286605/ \
    // initialize-angularjs-service-with-asynchronous-data
    
    $(function() {
        angular.bootstrap(document, ['mapApp']);
    });
});
