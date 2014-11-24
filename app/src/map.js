define(['angular', 'config'], function(angular) {

    var config = require('config');

    var map = new window.google.maps.Map(
                document.getElementById(config.MAP_ID), config.MAP_OPTS);
    
    angular.module('map', []).value('gMap', map).value('google', window.google);

    return { map: map, google: window.google };
});
