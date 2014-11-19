var mapApp = angular.module('mapApp', ['myMap']);

mapApp.controller('NavController', 
                  ['$scope', '$rootScope', '$timeout', 'gMap', 'google', 
                  function($scope, $rootScope, $timeout, gMap, google) {

    /** Display Elements **/

    $scope.displayingStartPosition = false;

    $scope.displayingMenu = false;

    $scope.menuToggle = function() {
        $scope.displayingMenu = !$scope.displayingMenu;

        // hack to get around multiple $apply() calls since this handler
        // is bound within angular as well as on a generic on('click')
        // @todo: find better way to bind the on('click') to the external
        // menu button
        if(!this.$root.$$phase)
            this.$apply();
    };

    angular.element('.fa.fa-bars').on('click', $scope.menuToggle.bind($scope));
   

    /** Geolocation Elements **/

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
            var place = $scope.destPositionAutoComplete.getPlace();

            $scope.destPos = place;
            $rootScope.$broadcast('setDirections', $scope.currPos, $scope.destPos);
            $rootScope.$broadcast('destChosen', place); 
        }
    );

    /**
     * @param pos Object containing {coords: { latitude: xxx, longitude: xxx }}
     */
    $scope.getPositionSuccess = function(pos) {
        
        $scope.positionAutoSet = true;
        $scope.displayingStartPosition = false;

        var lat = pos.coords.latitude.toFixed(5),
            lng = pos.coords.longitude.toFixed(5);

        if(!$scope.currPos || 
           $scope.rawCurrPos.lat != lat || 
           $scope.rawCurrPos.lng != lng) {

            $scope.rawCurrPos = {lat: lat, lng: lng};
            $scope.currPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            $rootScope.$broadcast('startChosen', $scope.currPos); 

        }
    };

    $scope.getPositionFail = function() {
        $scope.displayStartPosition();
    };
        
    $scope.displayStartPosition = function() {
        
        if($scope.displayingStartPosition)
            return;

        $scope.displayingStartPosition = true;
        $scope.startPositionAutoComplete = new google.maps.places.Autocomplete(angular.element('#start-pos').get(0));

        google.maps.event.addListener($scope.startPositionAutoComplete, 
            'place_changed', 
            function() {
                var place = $scope.startPositionAutoComplete.getPlace();

                $scope.startPos = place;
                $rootScope.$broadcast('startChosen', place); 
            });
    };


    /** Initialization Elements **/

    if(navigator.geolocation) {
        navigator.geolocation.watchPosition($scope.getPositionSuccess, $scope.getPositionFail, {timeout: 2000});

        $timeout(function() {

            if(!$scope.positionAutoSet)
                $scope.displayStartPosition();

        }, 5000);
    }
    else {
        $scope.displayStartPosition();
    }

}]);


mapApp.controller('SearchController', 
                  ['$scope', 'gMap', 'google', 
                  function($scope, gMap, google) {

    // @param dest google.maps.places.PlaceResult
    $scope.$on('destChosen', function(e, dest) {
        
        console.log('dest chosen to be', dest);
    });
}]);

mapApp.controller('DirectionsController',
                  ['$scope', 'gMap', 'google',
                  function($scope, gMap, google) {
    
    // instances of google.maps.places.PlaceResult, or a google.maps.LatLng object
    $scope.start = null;
    $scope.dest  = null;

    $scope.directionsService = new google.maps.DirectionsService;
    $scope.directionsRenderer = new google.maps.DirectionsRenderer();
    $scope.directionsRenderer.setMap(gMap);
    
    $scope.marker = new google.maps.Marker({
        map: gMap,
        title: "Me"
    });

    $scope.$on('startChosen', function(e, start) {
        $scope.start = start;

        if($scope.start.geometry)
            var start = $scope.start.geometry.location;
        else if($scope.start.lat)
            var start = $scope.start;

        gMap.setCenter(start); 

        $scope.marker.setPosition(start);

        console.log('received start', start);
        $scope.setDirections();
    });
    
    $scope.$on('destChosen', function(e, dest) {
        $scope.dest = dest;
        console.log('received dest', dest);
        $scope.setDirections();
    });

    // origin or dest may be undefined depending on whether the user has 
    // input an origin and destination
    $scope.setDirections  = function() {
        console.log('setDirections', $scope.start, $scope.dest);
        
        if(!$scope.start || !$scope.dest)
            return;

        // todo: clean this up by wrapping start and dest in 
        // an adapter with function latLng()
        if($scope.start.geometry)
            var start = $scope.start.geometry.location;
        else if($scope.start.lat)
            var start = $scope.start;

        if($scope.dest.geometry)
            var dest = $scope.dest.geometry.location;
        else if($scope.dest.lat)
            var dest = $scope.dest.lat;

        var request = {
            origin: start,
            destination: dest,
            travelMode: google.maps.TravelMode.DRIVING
        };
        
        $scope.directionsService.route(request, function(response, status) {
            
            if(status == google.maps.DirectionsStatus.OK) {
               $scope.directionsRenderer.setDirections(response); 
            }
        });
    };
}]);
