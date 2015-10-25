/*globals require*/
require.config({
    shim: {
        angular: {
            deps: [
                'jquery'
            ],
            exports: 'angular'
        },
        uiRouter: {
            deps: [
                'angular'
            ],
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
        domReady: '../lib/domReady/domReady',
        'angular-ui-router': '../lib/angular-ui-router/release/angular-ui-router',
        'requirejs-tpl-angular': '../lib/requirejs-tpl-angular/tpl',
        'angular-mocks': '../lib/angular-mocks/angular-mocks',
        bootstrap: '../lib/bootstrap/dist/js/bootstrap'
    },
    packages: [

    ],
    deps: [
        './app'
    ]
});
require(['main']);
