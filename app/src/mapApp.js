// using angular organization based on 
// http://solutionoptimist.com/2013/09/30/requirejs-angularjs-dependency-\
// injection/
define([
    'angular',
    'map',
    'controllers/nav_controller',
    'controllers/search_controller',
    'controllers/directions_controller',

    'filters/place_types',
    'filters/place_price'

], function(
    angular,
    map,

    NavController,
    SearchController,
    DirectionsController,

    PlaceTypesFilter,
    PlacePriceFilter
    ) {
    'use strict';

    var mapApp = angular.module('mapApp', ['map']).
        controller('NavController', NavController).
        controller('SearchController', SearchController).
        controller('DirectionsController', DirectionsController).

        filter(PlaceTypesFilter.name, PlaceTypesFilter.fn).
        filter(PlacePriceFilter.name, PlacePriceFilter.fn);
    
    return mapApp;
});
