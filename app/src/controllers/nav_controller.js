define(['lib/position_adapter'], function(PositionAdapter) {
    'use strict';

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
            if (!this.$root.$$phase)
                this.$apply();
        };

        angular.element('#nav-location-bar .fa.fa-bars').on('click', $scope.menuToggle.bind($scope));
       

        /** Geolocation Elements **/

        $scope.startPos = null;

        // object literal of {lat: float, lng: float} rounded to 5 decimal
        // used to evaluate if user moved
        $scope.rawCurrPos = null;

        // google.maps.LatLng class
        $scope.currPos = null;

        // google.maps.places.PlaceResult
        $scope.destPos = null;

        // Some browsers, on selecting 'not now' for geolocation, 
        // will not fire the failure callback. We'll wait an appropriate
        // amount of time, then automatically show the location menu if
        // this is still false.
        $scope.positionAutoSet = false;

        $scope.destPositionAutoComplete = new google.maps.places.Autocomplete(
            angular.element('#dest-pos').get(0),
            { bounds: gMap.getBounds() }
        );

        google.maps.event.addListener($scope.destPositionAutoComplete, 
            'place_changed', 
            function() {
                var place = new PositionAdapter($scope.destPositionAutoComplete.getPlace());

                $scope.destPos = place;
                $rootScope.$broadcast('destChosen', $scope.destPos); 
            }
        );

        /**
         * @param pos Object containing {coords: { latitude: xxx, longitude: xxx }}
         */
        $scope.getPositionSuccess = function(pos) {
            
            $scope.positionAutoSet = true;
            $scope.displayingStartPosition = false;

            var adaptedPos = new PositionAdapter(pos);

            // initialize starting position
            if (!$scope.startPos) {
                $scope.startPos = new PositionAdapter(pos);
                $rootScope.$broadcast('startChosen', $scope.startPos); 
            }
                
            // set current position
            if (!$scope.currPos || !$scope.currPos.isEqualTo(adaptedPos)) {
                $scope.currPos = adaptedPos;
                $rootScope.$broadcast('currPos', $scope.currPos); 
            }
        };

        $scope.getPositionFail = function() {
            $scope.displayStartPosition();
        };
            
        $scope.displayStartPosition = function() {
            
            if ($scope.displayingStartPosition)
                return;

            $scope.displayingStartPosition = true;
            $scope.startPositionAutoComplete = new google.maps.places.Autocomplete(angular.element('#start-pos').get(0));

            google.maps.event.addListener($scope.startPositionAutoComplete, 
                'place_changed', 
                function() {
                    var place = new PositionAdapter($scope.startPositionAutoComplete.getPlace());

                    $scope.startPos = place;
                    $rootScope.$broadcast('startChosen', $scope.startPos); 
                });
        };


        /** Initialization Elements **/

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition($scope.getPositionSuccess, $scope.getPositionFail, {timeout: 2000});

            $timeout(function() {

                if (!$scope.positionAutoSet)
                    $scope.displayStartPosition();

            }, 5000);
        }
        else {
            $scope.displayStartPosition();
        }
    };
    
    return ['$scope', '$rootScope', '$timeout', 'gMap', 'google', NavController];
});
