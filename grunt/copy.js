// Copies remaining files to places other tasks can use
module.exports = {
  dist: {
    files: [{
      expand: true,
      dot: true,
      cwd: '<%= config.app %>',
      dest: '<%= config.dist %>',
      src: [
        'content/**/**.*',
        '.htaccess',
        'images/{,*/}*.webp',
        // '{,*/}*.html',
        'styles/fonts/{,*/}*.*'
      ]
    },
    
    {
      expand: true,
      dot: true,
      flatten: true,
      cwd: '<%= config.app %>',
      dest: '<%= config.dist %>/fonts',
      src: [
        'lib/bootstrap/fonts/*'
      ]
    }]
  }
};
