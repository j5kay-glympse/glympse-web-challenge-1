/*globals require*/
require.config({
    shim: {
        angular: {
            deps: ['jquery'],
            exports: 'angular'
        },
        uiRouter: {
            deps: ['angular'],
            exports: 'uiRouter'
        }
    },
    paths: {
        famous: '../lib/famous/dist/famous',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        jquery: '../lib/jquery/dist/jquery',
        angular: '../lib/angular/angular',
        uiRouter: '../lib/angular-ui-router/release/angular-ui-router',
        tpl: '../lib/requirejs-tpl-angular/tpl',
        text: '../lib/text/text',
        domReady: '../lib/domReady/domReady'
    },
    packages: [

    ],
    deps: [
        './app'
    ]
});
require(['main']);
