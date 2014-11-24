define(['lib/position_adapter', 'jquery'], function(PositionAdapter, $) {
    'use strict';

    /**
     * Handles the selection of start and endpoints. 
     * It tries to use navigator.geolocation, but if it is rejected or
     * fails, will fallback to showing a starting position input.
     */ 
    function NavController($scope, $rootScope, $timeout, gMap, google) {

        /** Display Elements **/
        
        $scope.displayingStartPosition = false;

        $scope.displayingMenu = false;

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

        $('#nav-location-bar .glyphicon-align-justify').
            on('click', $scope.menuToggle.bind($scope));
       

        /** Geolocation Elements **/

        $scope.startPos = null;

        // google.maps.LatLng class
        $scope.currPos = null;

        // google.maps.places.PlaceResult
        $scope.destPos = null;

        // Some browsers on selecting 'not now' for geolocation 
        // will not fire the failure callback. We'll wait a reasonable
        // amount of time and then automatically show the location menu
        // if this is still false.
        $scope.positionAutoSet = false;

        $scope.destPositionAutoComplete = new google.maps.places.Autocomplete(
            $('#dest-pos').get(0),
            { bounds: gMap.getBounds() }
        );

        google.maps.event.addListener($scope.destPositionAutoComplete, 
            'place_changed', 
            function() {
                var place = new PositionAdapter($scope.destPositionAutoComplete.getPlace());

                $scope.destPos = place;
                $rootScope.$broadcast('destChosen', $scope.destPos); 
                $scope.displayingMenu = false;
            }
        );

        /**
         * Callback when current position is discovered via geolocation 
         * (both the first time and on position update).
         * The first time it's called, $scope.startPos hasn't been set.
         *
         * @param pos Object containing {coords: { latitude: xxx, longitude: xxx }}
         */
        $scope.getPositionSuccess = function(pos) {
            
            $scope.positionAutoSet = true;

            $scope.displayingStartPosition = false;

            var adaptedPos = new PositionAdapter(pos);

            // initialize starting position
            if (!$scope.startPos) {
                $scope.startChosen(new PositionAdapter(pos));

                $scope.$apply(function() {
                    $scope.displayingMenu = true;
                });
            }
                
            // set current position
            if (!$scope.currPos || !$scope.currPos.isEqualTo(adaptedPos)) {
                $scope.currPos = adaptedPos;
                $rootScope.$broadcast('currPos', $scope.currPos); 
            }
        };
        
        /**
         * Callback for geolocation lookup failure
         */
        $scope.getPositionFail = function() {
            $scope.displayStartPosition();
        };
            
        /**
         * Forceful display of the start position input with autocomplete.
         * Used if geolocation is rejected or not available
         */
        $scope.displayStartPosition = function() {
            
            if ($scope.displayingStartPosition) {
                return;
            }

            $scope.displayingStartPosition = true;
            $scope.startPositionAutoComplete = 
                new google.maps.places.Autocomplete($('#start-pos').get(0));

            google.maps.event.addListener($scope.startPositionAutoComplete, 
                'place_changed', 
                function() {
                    var place = new PositionAdapter(
                                    $scope.startPositionAutoComplete.getPlace());

                    $scope.startChosen(place);
                });
        };

        /**
         * @param pos PositionAdapter
         */
        $scope.startChosen = function(pos) {
            $scope.startPos = pos;
            $rootScope.$broadcast('startChosen', $scope.startPos); 
        };


        /** Initialization Elements **/

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                $scope.getPositionSuccess, 
                $scope.getPositionFail, 
                {timeout: 2000});

            $timeout(function() {

                if (!$scope.positionAutoSet) {
                    $scope.displayStartPosition();
                }

            }, 5000);
        }
        else {
            $scope.displayStartPosition();
        }
    }
    
    return ['$scope', '$rootScope', '$timeout', 'gMap', 'google', NavController];
});
