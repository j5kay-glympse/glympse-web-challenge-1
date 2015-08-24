/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: '../lib/famous/src',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        jquery: '../lib/jquery/dist/jquery',
        'google-maps': '../lib/google-maps/lib/Google'
    },
    packages: [

    ]
});
require(['main', 'map']);
