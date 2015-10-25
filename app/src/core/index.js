/* globals define */
define(function(require) {
	'use strict';

	require('./routes');
	require('./controllers/index');
	require('./factories/map');
	require('./factories/search');
	require('./factories/directions');
	require('./services/geolocation');
	require('./services/notification');
	require('./directives/loadingIndicator');
	require('./directives/geoData');
	require('./directives/searchBox');
	require('./directives/searchResult');
});
