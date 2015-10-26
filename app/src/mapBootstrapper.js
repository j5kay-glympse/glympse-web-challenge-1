// namespace for the map logic on window
window.map = {};

/**
 * Keep track of google map's state and make callbacks once the map library has
 * loaded
 *
 * @constructor
 */
function MapBootstrapper() {
	this.callbacksOnMapInit = [];
	var that = this;

	window.mapBootstrapperCallback = function() {
		that.callbacksOnMapInit.forEach(function(callback) {
			callback();
		});
		window.map.ready = true;
	};
}

MapBootstrapper.prototype.addCallback = function(callback) {
	this.callbacksOnMapInit.push(callback);
};

window.map.bootstrapper = new MapBootstrapper();
