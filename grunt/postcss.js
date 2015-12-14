module.exports = {
	options: {
		map: {
			inline: false, // save all sourcemaps as separate files...
			annotation: 'dist/css/maps/' // ...to the specified directory
		},
		processors: [
			require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
		]
	},
	dist: {
		src: './app/styles/*.css'
	}
};
