# High Priority

1. Search for nearby POIs based on center/viewport bounds and zoom level 
rather than static 500m
1. Better panes for destination and search
1. Error handling. Had added a global error handler in main.js (see 87b8f936022)
but grunt:dist was failing. An angular based error logging mechanism should also
be added.
1. Better responsive header.

# Lower Priority / Nice to Have

* Integrate better environment specific configuration, ala one of these methods
 * http://newtriks.com/2013/11/29/environment-specific-\
 configuration-in-angularjs-using-grunt/
 * http://mindthecode.com/how-to-use-environment-variables-in-your-angular-\
 application/
