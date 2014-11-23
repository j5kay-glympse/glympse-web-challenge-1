define(['lib/position_adapter', 'jquery'], function(PositionAdapter, $) {
    'use strict';

    function SearchController($scope, $rootScope, gMap, google) {

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

        // @param dest PositionAdapter. Should include a PlaceResult as dest.gPlaceResult
        $scope.$on('destChosen', function(e, dest) {
            
            // avoids cyclicabl destination lookup
            if ($scope.currPlace == dest.gPlaceResult) {
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

        $scope.onPhotosClick = function(placeId, $event) {
            
            $event.stopPropagation();

            var urls = $scope.placesMap[placeId].photos.map(function(photo) {
                return photo.getUrl({maxWidth: 800, maxHeight: 600});
            });

            console.log('on photos click photo urls', $scope.placesMap[placeId].photos.length, urls);
        };
    }

    return ['$scope', '$rootScope', 'gMap', 'google', SearchController];

});
