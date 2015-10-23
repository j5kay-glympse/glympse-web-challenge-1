var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: allTestFiles,

  shim: {
    angular: {
      deps: [
        'jquery'
      ],
      exports: 'angular'
    },
    'ui-router': {
      deps: [
        'angular'
      ],
      exports: 'ui-router'
    }
  },
  paths: {
    famous: 'app/lib/famous/dist/famous',
    requirejs: 'app/lib/requirejs/require',
    almond: 'app/lib/almond/almond',
    jquery: 'app/lib/jquery/dist/jquery',
    angular: 'app/lib/angular/angular',
    'ui-router': 'app/lib/angular-ui-router/release/angular-ui-router',
    'angular-ui-router': 'app/lib/angular-ui-router/release/angular-ui-router'
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
