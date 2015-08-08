#Local Lunch Locator
> Simple Map Destination Picker exercise

##Challenge outline
Your challenge is to build a web-app that allows a user to search for, select, and display a route from the user's current location to the selected destination. The app must be built in the provided module-based framework. However, you are free to import anything you need to help with building the app.

Here is an outline/checklist of all items necessary for a successful challenge result:


#################################################################################################################################

	OK - Leverage the provided app container structure (see instructions below how to set up for the node/grunt/bower environment)
	OK - Initialize/load your favorite map control (Google, HERE, OSM, etc.)
	OK - Get the user's current location and show it on the map
	OK  - Use `navigator.geolocation`
	OK  - Center map on retrieved latlng at some default zoom level (13-15 are pretty good defaults)
	OK  - *BONUS*: Show custom user icon
  			- *BONUS*: Show other information about geolocation result (accuracy, elevation, heading, etc.)
  			- *BONUS*: Update user's location as they move around

	OK - Provide a button/panel that allows the user to type in a destination 

	OK - Perform a search for nearby POIs that match the entered destination input
	- Use the current map's center/viewport bounds + zoom as params for the search

	OK - Results of the search should appear in a list in some manner for interaction (maps icons, sidebar, pop-up, etc.)
  			- *BONUS*: Show additional info about each search result (distance away, provided images/icons, search result type, etc.)
  			- *BONUS*: Cool list container / UI layout


	OK - Each entry should be selectable

	OK - Show/highlight an entry on the map if it is selected
  			OK - *BONUS*: center/zoom the map based on user's and destination location
  			- *BONUS*: make cool animation when transitioning

	OK - Retrieve/plot a route from the user's current location to the destination
  			OK - *BONUS*: Show additional info about destination via pop-up balloon over destination marker
  			- *BONUS*: Use custom icon for destination marker
			- **_SUPER-DUPER BONUS_**: Make a responsive app that accomodates viewport sizes ranging between phone and desktop



######################################################################################################################################












There are a couple of wireframes (in `samples/`) of an example mobile UX flow for this destination picker project. By no means are you constrained by these designs. They have been included only as reference examples. Feel free to use other sources of inspiration (i.e. Google Maps' destination search/selection, Bing, etc.)

And to be clear, the goal of this challenge is to get through the tasks in a clean and reasonable manner to adquetly demonstrate your various web development skills. You can certainly spend a lot of time finessing the experience, which would be awesome, but *absolutely* not required.

##Review-ready state

The final solution should be a production-ready release. This can be done via ```grunt``` in the root directory to run the project through various linters and minification processes (final result shows up in dist/ directory). There should be no errors (i.e. no `--force` option needed).

Once everything is ready for review, generate a pull-request with your changes. That's it!


##Getting Started
It is actually quite simple really!

First make sure you have node.js installed... without that nothing works!  You can either install it with your favorite package manager or with [the installer](http://nodejs.org/download) found on [nodejs.org](http://nodejs.org).

Once you have node set up, you'll need to install app-specific packages to facilitate all of the automated building for the Challenge.

Here are the steps:

1. cd into the project's root directory (i.e. `glympse-web-challenge-1/`)
2. This project relies on grunt-cli, and bower to do all the heavy lifting for you, so: `npm install -g grunt-cli bower`
3. Now, install all of the base project dependencies: `npm install && bower install`

That's it!!! You are now ready for the challenge.

##Notes on making your app
There is an opinionated structure for your app as you build it:

- All app-related resources live in `app/`.
- All code lives under `app/src`. `main.js` is the entry point into the app, which is stubbed as a starting point.
- HTML content lives in the root of the `app/` directory.
- Images live under `app/content/images` (with a sample glympse.png *by pure coincidence*)
- CSS lives under `app/styles` (again, with a stubbed reference)

Feel free to modify/add as necessary, but maintaining folder structure helps for `grunt` stuff.

Please use `bower` for external resource management!

##Running a Development Server

Simply run ```grunt serve``` and you will start a local development server and open Chrome.  Watch tasks will be running, and your browser will be automatically refreshed whenever a file in the repo changes.

If you would like to have your server be accessible to other devices on your local machine use the option ```--hostname=0.0.0.0```

If you don't like your browser being opened for use a ```--no-open``` flag to disable the feature

## Release History
 * 2014-10-29   v1.0.0   Heavily inspired by the [Yeoman Generator](https://github.com/FamousTools/generator-famous) for [Famo.us](http://famo.us)
