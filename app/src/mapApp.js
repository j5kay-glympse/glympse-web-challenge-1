var mapApp = angular.module('mapApp', ['myMap']);

/**
 * Provides standard lat & lng interface
 *
 * @param window.geolocation result | 
 *        google.maps.PlaceResult | 
 *        google.maps.LatLng
 */
function PositionAdapter(position) {
    this.init(position);
}

PositionAdapter.prototype = {

    lat: null,
    lng: null,

    html5Pos: null,

    gLatLng: null,

    gPlaceResult: null,

    init: function(position) {

        if (!position || typeof position != 'object')
            throw new Error('Invalid position object in new PositionAdapter');

        if (position.coords) {
            this.html5Pos = position;
            this.lat = this.html5Pos.coords.latitude;
            this.lng = this.html5Pos.coords.longitude;
        }

        else if (position instanceof google.maps.LatLng) {
            this.gLatLng = position;
            this.lat = this.gLatLng.lat();
            this.lng = this.gLatLng.lng();
        }

        // Test if it is Position'ish
        else if (position.geometry && position.place_id) {
            this.gPlaceResult = position;
            this.lat = this.gPlaceResult.geometry.location.lat();
            this.lng = this.gPlaceResult.geometry.location.lng();
        }

        else
            throw new Error('Unsupported position object in new PositionAdapter');

    },

    toLatLng: function() {
        if (this.gLatLng)
            return this.gLatLng;
        else
            return new google.maps.LatLng(this.lat, this.lng);
    },

    isEqualTo: function(pos) {
       
        if (!pos instanceof PositionAdapter)
            pos = new PositionAdapter(pos);

        return pos.lat == this.lat && pos.lng == this.lng;
    }
};

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

}]);


mapApp.controller('SearchController', 
                  ['$scope', '$rootScope', 'gMap', 'google', 
                  function($scope, $rootScope, gMap, google) {

    $(function() {
        $('#search-inner').css('height', $(window).height() + 'px');
    });
    $scope.displayingMenu = false;

    $scope.places = [];
    $scope.placesMap = {};

    $scope.currPlace = null;

    $scope.placesService = new google.maps.places.PlacesService(gMap);
        
    $scope.badge = angular.element('#nav-search-bar .badge');

    $scope.menuToggle = function() {
        $scope.displayingMenu = !$scope.displayingMenu;

        // hack to get around multiple $apply() calls since this handler
        // is bound within angular as well as on a generic on('click')
        // @todo: find better way to bind the on('click') to the external
        // menu button
        if (!this.$root.$$phase)
            this.$apply();
    };

    angular.
        element('#nav-search-bar button').
        on('click', $scope.menuToggle.bind($scope));

    // @param dest PositionAdapter. Should include a PlaceResult as dest.gPlaceResult
    $scope.$on('destChosen', function(e, dest) {
        
        // avoids cyclicabl destination lookup
        if($scope.currPlace == dest.gPlaceResult)
            return;

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

            for (var i=0; i<results.length; ++i)
                $scope.placesMap[results[i].id] = results[i];

            angular.element('.badge').text(results.length);
        }
    };

    $scope.onPlaceClick = function(placeId, $event) {
        
        var place = $scope.placesMap[placeId];

        if(!place)
            return;

        $scope.currPlace = place;

        angular.element('#search-results .place-additional').hide();
        angular.element($event.currentTarget).find('.place-additional').show();
            
        $rootScope.$broadcast('destChosen', new PositionAdapter(place));
    };

    $scope.onPhotosClick = function(placeId, $event) {
        
        $event.stopPropagation();

        var urls = $scope.placesMap[placeId].photos.map(function(photo) {
            return photo.getUrl({maxWidth: 800, maxHeight: 600});
        });

        console.log('on photos click photo urls', $scope.placesMap[placeId].photos.length, urls);
    }


}]);

mapApp.controller('DirectionsController',
                  ['$scope', 'gMap', 'google',
                  function($scope, gMap, google) {
    
    // instances of PlaceAdapter
    $scope.start = null;
    $scope.curr  = null;
    $scope.dest  = null;

    $scope.directionsService = new google.maps.DirectionsService;
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
        
        if (!$scope.start || !$scope.dest)
            return;

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
}]);

mapApp.filter('placeTypes', function() {
    
    function titleCase(str) {

        // http://stackoverflow.com/questions/4878756/javascript-how-to-\
        // capitalize-first-letter-of-each-word-like-a-2-word-city
        // 
        // with our removal of underscores to create words
        return str.
                replace('_', ' ').
                replace(/\w\S*/g, function(txt){
                    return txt.charAt(0).toUpperCase() + 
                           txt.substr(1).toLowerCase();
                });
    }

    return function(types) {
        
        // ambiguous types to not include
        var ignored = ['establishment'];
        
        var result = [];

        for (var i=0; i<types.length; ++i) {
            if (ignored.indexOf(types[i]) != -1)
                continue;

            result.push(titleCase(types[i]));
        }

        return result.join(', ');
    };
});

mapApp.filter('placePrice', function() {
    
    return function(price) {
        
        if (price == 0)
            return 'Free';

        var result = '';

        for (var i=0; i<price; ++i)
            result += '$';

        return result;
    };
});
