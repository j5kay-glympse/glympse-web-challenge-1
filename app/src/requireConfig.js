/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: '../lib/famous/src',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        jquery: '../lib/jquery/dist/jquery',
        googlemaps: '../lib/googlemaps-amd/src/googlemaps',
        async: '../lib/requirejs-plugins/src/async'
    },
    packages: [

    ],
    googlemaps: {
        params: {
            key: 'AIzaSyAXjjpKlzLPVOMkPrdntY69JGG64lEegqY',
            libraries: 'places'
        }
    }
});

require(['main']);
