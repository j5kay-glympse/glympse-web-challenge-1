/*globals require*/
require.config({
    shim: {
        angular: {
            deps: [
                'jquery'
            ],
            exports: 'angular'
        },
        'ui-router': {
            deps: [
                'angular'
            ],
            exports: 'ui-router'
        }
    },
    paths: {
        famous: '../lib/famous/src',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        jquery: '../lib/jquery/dist/jquery',
        angular: '../lib/angular/angular',
        'ui-router': '../lib/angular-ui-router/release/angular-ui-router',
        'angular-ui-router': '../lib/angular-ui-router/release/angular-ui-router'
    },
    packages: [

    ]
});
require(['main']);
