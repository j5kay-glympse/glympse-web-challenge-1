/*globals require*/
require.config({
    shim: {
        mapbox: {
            exports: 'L'
        }
    },
    paths: {
        famous: '../lib/famous/src',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        jquery: '../lib/jquery/dist/jquery',
        mapbox: '../lib/mapbox.js/mapbox',
        grunt: '../lib/grunt/lib/grunt'
    },
    packages: [

    ]
});
require(['main']);
