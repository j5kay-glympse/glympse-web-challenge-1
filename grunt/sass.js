/**
 * Grunt task configuration - sass
 */
module.exports = {
	/**
	 * Dev
	 */
	dev: {
		options: {
			style: "expanded"
		},
		files: {
			"<%= config.app %>/styles/app.css": [
				"<%= config.app %>/scss/app.scss"
			]
		}
	},


	/**
	 * Production
	 */
	dist: {
		options: {
			style: "compressed"
		},
		files: {
			"<%= config.app %>/styles/app.css": [
				"<%= config.app %>/scss/app.scss"
			]
		}
	}
};