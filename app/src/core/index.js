/* globals define */
define(function(require) {
	'use strict';

	require('./routes');
	require('./controllers/index');
	require('./factories/map');
	require('./services/geolocation');
	require('./services/notification');
	require('./directives/loadingIndicator');
	require('./directives/geoData');
});
