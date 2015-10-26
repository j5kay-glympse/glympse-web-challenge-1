/* globals define */
define(function(require) {
	'use strict';

	var ng = require('angular');
	require('uiRouter');

	require('./core/index');

	return ng.module('app', [
		'tpl',
		'app.core',
		'ui.router'
	]);
});
