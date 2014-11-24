/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var $       = require('jquery'),
        angular = require('angular');

    exports.$ = $;

    requirejs.onError = function(err) {
        console.log('onError', err);
    };
    
    // delay initialization so that the map is ready
    // via http://stackoverflow.com/questions/16286605/ \
    // initialize-angularjs-service-with-asynchronous-data
    
    $(function() {

        require(
            ['mapApp'], 

            function(mapApp) {
                angular.bootstrap(document, ['mapApp']);
            },

            // some basic error handling.
            // @see http://requirejs.org/docs/api.html#errors
            function(err) {
                $('#gen-error').removeClass('hidden').addClass('show');

                if(window.console && window.console.error) {
                    console.error(
                        "Failure in mapApp. Error name '%s'. Message: %s", 
                        err.name, 
                        err.message || err.description 
                    );
                }

            }
        );
        
    });
});
