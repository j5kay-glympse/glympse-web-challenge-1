define([], function() {
    'use strict';
    
    return {
        name: 'placeTypes',
        fn: function() {
    
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
        }
    };
});
