module.exports = {
    markers: {
        src: '<%= config.app %>/content/sprite/marker/*.png',
	    retinaSrcFilter: "<%= config.app %>/content/sprite/marker/*@2x.png",
        dest: '<%= config.app %>/content/images/sprite-marker.png',
	    retinaDest: "<%= config.app %>/content/images/sprite-marker-retina.png",
        destCss: '<%= config.app %>/data/sprite-marker.json',
	    imgPath: './content/images/sprite-marker.png',
	    retinaImgPath: './content/images/sprite-marker-retina.png',
        padding: 10
    },
    ui: {
        src: '<%= config.app %>/content/sprite/ui/*.png',
	    retinaSrcFilter: "<%= config.app %>/content/sprite/ui/*@2x.png",
        dest: '<%= config.app %>/content/images/sprite-ui.png',
	    retinaDest: "<%= config.app %>/content/images/sprite-ui-retina.png",
        destCss: '<%= config.app %>/scss/generated/sprite-ui.scss',
	    imgPath: '../content/images/sprite-ui.png',
	    retinaImgPath: '../content/images/sprite-ui-retina.png',
        padding: 10
    }
};