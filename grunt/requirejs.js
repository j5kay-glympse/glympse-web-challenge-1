module.exports =  {
  compile: {
    options: {
      optimize: 'uglify2',
      findNestedDependencies: true,
      baseUrl: '<%= config.app %>/src',
      mainConfigFile: '<%= config.app %>/src/requireConfig.js',
      name: 'almond',
      include: 'main',
      insertRequire: ['main'],
      out: '<%= config.dist %>/src/main.js',
      wrap: true,
      paths: {
        googleMaps: 'empty:'
      }
    }
  }
};
