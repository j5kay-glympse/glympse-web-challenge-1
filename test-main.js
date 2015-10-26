var allTestFiles = [];
var TEST_REGEXP = /_test\.js$/i;

var filter;

if (window.__karma__.config.filter) {
  filter = window.__karma__.config.filter;
  filter = new RegExp(filter);
}

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

function testPath(path) {
  if (typeof filter !== 'undefined') {
    return filter.test(path);
  }
  return true;
}

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file) && testPath(file)) {
    // Normalize paths to RequireJS module names.
    console.log(pathToModule(file));
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/',

  // dynamically load all test files
  deps: allTestFiles,

  shim: {
    angular: {
      deps: [
        'jquery'
      ],
      exports: 'angular'
    },
    'angularMocks': {
      deps: ['angular']
    },
    uiRouter: {
      deps: [
        'angular'
      ],
      exports: 'uiRouter'
    }
  },
  paths: {
    'famous': 'app/lib/famous/dist/famous',
    'requirejs': 'app/lib/requirejs/require',
    'almond': 'app/lib/almond/almond',
    'jquery': 'app/lib/jquery/dist/jquery',
    'angular': 'app/lib/angular/angular',
    'angularMocks': 'app/lib/angular-mocks/angular-mocks',
    uiRouter: 'app/lib/angular-ui-router/release/angular-ui-router',
    'angular-ui-router': 'app/lib/angular-ui-router/release/angular-ui-router',
    'tpl': 'app/lib/requirejs-tpl-angular/tpl',
    'requirejs-tpl-angular': 'app/lib/requirejs-tpl-angular/tpl',
    'text': 'app/lib/text/text',
    'domReady': 'app/lib/domReady/domReady'
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
