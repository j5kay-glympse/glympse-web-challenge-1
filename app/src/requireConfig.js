/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famousClassList: '../lib/famous-polyfills/classList',
        famousPrototypeBind: '../lib/famous-polyfills/functionPrototypeBind',
        famousAnimationFrame: '../lib/famous-polyfills/requestAnimationFrame',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        jquery: '../lib/jquery/dist/jquery'
    },
    packages: [

    ]
});
require(['main']);
