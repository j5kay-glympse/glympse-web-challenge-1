/*globals require*/
require.config({
	shim: {
		'bootstrap/alert': { deps: ['jquery']}
	},
	paths: {
		famous: '../lib/famous/src',
		requirejs: '../lib/requirejs/require',
		almond: '../lib/almond/almond',
		jquery: '../lib/jquery/dist/jquery',
		bootstrap: '../lib/bootstrap/dist/js/bootstrap'
	},
	packages: [

	]
});
require(['main']);
