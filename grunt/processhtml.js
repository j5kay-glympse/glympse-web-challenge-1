module.exports = {

  // todo: integrate better env specific config hash
  dev: {
    files: {
      '.tmp/index.html': ['<%= config.app %>/index.html']
    },

    options: {
        data: {
            gmap_id: 'AIzaSyB2pWQQon_-BRhcRqOr-ujdgnYwclzl_zQ'
        }
    }
  },
  dist: {
    files: {
      '<%= config.dist %>/index.html': ['<%= config.app %>/index.html']
    },

    options: {
        data: {
            gmap_id: 'AIzaSyB2pWQQon_-BRhcRqOr-ujdgnYwclzl_zQ'
        }
    }
  },
  options: {
    commentMarker: 'process'
  }
};
