/*globals require*/
require.config({
	shim: {
		'TimelineLite': {
			deps: ['../lib/greensock/src/minified/TweenMax.min'],
			exports: 'TimelineLite'
		}
	},
	paths: {
		famous: '../lib/famous/src',
		requirejs: '../lib/requirejs/require',
		almond: '../lib/almond/almond',
		jquery: '../lib/jquery/dist/jquery',
		TweenLite: '../lib/greensock/src/minified/TweenLite.min',
		TimelineLite: '../lib/greensock/src/minified/TimelineLite.min',
		q: '../lib/q/q',
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
		text: '../lib/requirejs-plugins/lib/text'
	},
	packages: []
});
require(['main']);
