module.exports = {
	dev: {
		options: {
			paths: ['app/styles/less']
		},
		files: {
			'app/styles/app.css': 'app/styles/less/core.less'
		}
	},
	dist: {
		options: {
			paths: ['app/styles/less'],
			plugins: [
				new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions']}),
				new (require('less-plugin-clean-css'))()
			]
		},
		files: {
			'app/styles/app.css': 'app/styles/less/core.less'
		}
	}
};