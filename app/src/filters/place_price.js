define([], function() {
    'use strict';

    return {
        name: 'placePrice',
        fn: function() {
    
            return function(price) {
                
                if (price == 0) {
                    return 'Free';
                }

                var result = '';

                for (var i=0; i<price; ++i) {
                    result += '$';
                }

                return result;
            };
        }
    };
});
