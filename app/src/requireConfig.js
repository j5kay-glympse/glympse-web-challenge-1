/*globals require*/
require.config({
    shim: {
        angular: {
            exports: 'angular'
        },

        gmap: {
            exports: 'google'
        }
    },
    paths: {
        famous: '../lib/famous/src',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        jquery: '../lib/jquery/dist/jquery',
        angular: '../lib/angular/angular',
        async: '../lib/requirejs-plugins/src/async',
        depend: '../lib/requirejs-plugins/src/depend',
        font: '../lib/requirejs-plugins/src/font',
        goog: '../lib/requirejs-plugins/src/goog',
        image: '../lib/requirejs-plugins/src/image',
        json: '../lib/requirejs-plugins/src/json',
        mdown: '../lib/requirejs-plugins/src/mdown',
        noext: '../lib/requirejs-plugins/src/noext',
        propertyParser: '../lib/requirejs-plugins/src/propertyParser',
        'Markdown.Converter': '../lib/requirejs-plugins/lib/Markdown.Converter',
        text: '../lib/requirejs-plugins/lib/text',
        bootstrap: '../lib/bootstrap/dist/js/bootstrap',
        'font-awesome': '../lib/font-awesome/fonts/*'
    },
    packages: [

    ]
});
require(['main']);
