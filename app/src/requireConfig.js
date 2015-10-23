/*globals require*/
require.config({
    shim: {
        angular: {
            deps: [
                'jquery'
            ],
            exports: 'angular'
        }
    },
    paths: {
        famous: '../lib/famous/src',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        jquery: '../lib/jquery/dist/jquery',
        angular: '../lib/angular/angular'
    },
    packages: [

    ]
});
require(['main']);
