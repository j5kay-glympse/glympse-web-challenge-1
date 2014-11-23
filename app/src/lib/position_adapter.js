define([], function() {
    'use strict';

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

            if (!position || typeof position != 'object') {
                throw new Error('Invalid position object in new PositionAdapter');
            }

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

            else {
                throw new Error('Unsupported position object in new PositionAdapter');
            }

        },

        toLatLng: function() {
            if (this.gLatLng) {
                return this.gLatLng;
            }
            else {
                return new google.maps.LatLng(this.lat, this.lng);
            }
        },

        isEqualTo: function(pos) {
           
            if (!pos instanceof PositionAdapter) {
                pos = new PositionAdapter(pos);
            }

            return pos.lat == this.lat && pos.lng == this.lng;
        }
    };

    return PositionAdapter;

});
