define(['lib/position_adapter', 'jquery'], function(PositionAdapter, $) {
    'use strict';

    function DirectionsController($scope, gMap, google) {
    
        // instances of PlaceAdapter
        $scope.start = null;
        $scope.curr  = null;
        $scope.dest  = null;

        $scope.directionsService = new google.maps.DirectionsService();
        $scope.directionsRenderer = new google.maps.DirectionsRenderer();
        $scope.directionsRenderer.setMap(gMap);
        
        $scope.startMarker = new google.maps.Marker({
            map: gMap,
            title: 'Start'
        });

        var img = {
            url: 'content/silly_walks/walk2.png',
            size: new google.maps.Size(30, 45),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(5, 44)
        };
        
        $scope.currMarker = new google.maps.Marker({
            map: gMap,
            title: 'Current',
            icon: img
        });

        $scope.$on('startChosen', function(e, start) {
            $scope.start = start;

            gMap.setCenter($scope.start.toLatLng()); 

            $scope.startMarker.setPosition(start);

            $scope.setDirections();
        });
        
        $scope.$on('currPos', function(e, curr) {
            $scope.curr = curr;
            
            $scope.currMarker.setPosition($scope.curr.toLatLng());

        });
        
        $scope.$on('destChosen', function(e, dest) {
            $scope.dest = dest;
            $scope.setDirections();
        });

        // origin or dest may be undefined depending on whether the user has 
        // input an origin and destination
        $scope.setDirections  = function() {
            console.log('setDirections', $scope.start, $scope.dest);
            
            if (!$scope.start || !$scope.dest) {
                return;
            }

            var request = {
                origin: $scope.start.toLatLng(),
                destination: $scope.dest.toLatLng(),
                travelMode: google.maps.TravelMode.DRIVING
            };
            
            $scope.directionsService.route(request, function(response, status) {
                
                if (status == google.maps.DirectionsStatus.OK) {
                   $scope.directionsRenderer.setDirections(response); 
                }
            });
        };
    }

    return ['$scope', 'gMap', 'google', DirectionsController];

});
