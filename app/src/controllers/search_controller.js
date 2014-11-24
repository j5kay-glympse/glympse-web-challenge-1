define(['lib/position_adapter', 'jquery'], function(PositionAdapter, $) {
    'use strict';

    /**
     * Searches for nearby POIs when a destination is originally chosen.
     * It displays extra information about POIs when clicked and will 
     * notify the other controllers that a new destiation has been chosen.
     */
    function SearchController($scope, $rootScope, gMap, google) {

        // @todo: figure out better layout to get this panel to show 100% height
        $(function() {
            $('#search-inner').css('height', $(window).height() + 'px');
        });

        $scope.displayingMenu = false;

        $scope.places = [];
        $scope.placesMap = {};

        $scope.currPlace = null;

        $scope.placesService = new google.maps.places.PlacesService(gMap);
            
        $scope.badge = $('#nav-search-bar .badge');

        $scope.menuToggle = function() {
            $scope.displayingMenu = !$scope.displayingMenu;

            // hack to get around multiple $apply() calls since this handler
            // is bound within angular as well as on a generic on('click')
            // @todo: find better way to bind the on('click') to the external
            // menu button
            if (!this.$root.$$phase) {
                this.$apply();
            }
        };

        $('#nav-search-bar button').on('click', $scope.menuToggle.bind($scope));

        /**
         * @param dest PositionAdapter. Should include a 
         * google.maps.PlaceResult as dest.gPlaceResult
         */
        $scope.$on('destChosen', function(e, dest) {
            
            if (!dest.gPlaceResult) {
                return;
            }
            // avoids cyclicabl destination lookup
            else if ($scope.currPlace == dest.gPlaceResult) {
                return;
            }

            $scope.displayingMenu = false;

            // todo: use viewport and zoom to determine radius
            var request = {
                location: dest.toLatLng(),
                radius: 500,
                types: ['art_gallery', 'bakery', 'bar', 'bowling_alley', 'casino', 
                        'food', 'movie_theater', 'park', 'spa']
            };

            $scope.placesService.nearbySearch(request, $scope.onNearbySearch);
        });

        $scope.onNearbySearch = function(results, status) {
            
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                
                $scope.places = results;
                $scope.$apply();

                for (var i=0; i<results.length; ++i) {
                    $scope.placesMap[results[i].id] = results[i];
                }

                $('.badge').text(results.length);
            }
        };

        $scope.onPlaceClick = function(placeId, $event) {
            
            var place = $scope.placesMap[placeId];

            if (!place) {
                return;
            }

            $scope.currPlace = place;

            $('#search-results .place-additional').hide();
            $($event.currentTarget).find('.place-additional').show();
                
            $rootScope.$broadcast('destChosen', new PositionAdapter(place));
        };
    }

    return ['$scope', '$rootScope', 'gMap', 'google', SearchController];

});
