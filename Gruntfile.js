/*global module:false*/
module.exports = function (grunt) {

	'use strict';

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-plato');
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	/**
	 * Grunt tasks
	 */

	// default task - run tests and package
	grunt.registerTask('default', [ 'clean:build', 'jshint', 'karma:once', 'requirejs', 'sass', 'copy', 'clean:buildSrc', 'compress' ]);

	// web server at http://localhost:9876/base/src/test/index.html
	grunt.registerTask('browser', [ 'karma:browser' ]);

	// skip tests and create package
	grunt.registerTask('dist', [ 'clean:build', 'requirejs', 'sass', 'copy', 'clean:buildSrc', 'compress' ]);

	// continuous compilation
	grunt.registerTask('auto-dist', [ 'dist', 'watch' ]);

	// continuous testing
	grunt.registerTask('auto-test', [ 'karma:watch' ]);

	// create code quality report
	grunt.registerTask('report', [ 'plato:src' ]);

	// default task run by CI server
	grunt.registerTask('ci', [ 'clean:build', 'jshint', 'karma:once' ]);

	// grunt version::[major.minor.patch] - update version based on package.json

	/*
	 * Configuration
	 */

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		vars: {
			build: '_build',
			dist: '_build/<%= pkg.name %>',
			license: grunt.file.read('LICENSE')
		},
		clean: {
			build: [ '<%= vars.build %>' ],
			buildSrc: [
				'<%= vars.dist %>/**/*.spec.js',
				'<%= vars.dist %>/**/*.fixture.*',
				'<%= vars.dist %>/**/*.mock.*',
				'<%= vars.dist %>/src/mout',
				'<%= vars.dist %>/src/test',
				'<%= vars.dist %>/**/*.scss',
				'<%= vars.dist %>/src/build.txt'
			]
		},
		jshint: {
			files: [ 'src/**/*.js' ],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		version: {
			defaults: {
				src: [
					'package.json',
					'manifest.json',
					'bower.json'
				]
			}
		},
		karma: {
			options: {
				configFile: 'src/test/karma.conf.js'
			},
			once: {
				singleRun: true
			},
			watch: {
				singleRun: false
			},
			browser: {
				singleRun: false,
				preprocessors: {}
			}
		},
		sass: {
			dist: {
				options: {
					sourceMap: true
				},
				files: {
					'<%= vars.dist %>/src/dashboard/main.css': 'src/dashboard/main.scss',
					'<%= vars.dist %>/src/popup/main.css': 'src/popup/main.scss',
					'<%= vars.dist %>/src/settings/main.css': 'src/settings/main.scss'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: "src",
					mainConfigFile: 'src/common/main.js',
					dir: '<%= vars.dist %>/src',
					removeCombined: true,
					inlineText: true,
					useStrict: true,
					preserveLicenseComments: true,
					optimize: 'none',
					optimizeCss: 'none',
					uglify: {
						toplevel: true,
						max_line_length: 100
					},
					wrap: {
						start: "/*\n<%= vars.license %>\n*/\n(function() {",
						end: "}());"
					},
					paths: {
						// override default
						'common-ui/core': 'common-ui/core'
					},
					modules: [
						{
							name: 'common/main'
						},
						{
							name: 'common-ui/main',
							exclude: ['common/main']
						},
						{
							name: 'core/main',
							exclude: ['common/main', 'common-ui/main']
						},
						{
							name: 'settings/main-app',
							exclude: ['common/main', 'common-ui/main']
						},
						{
							name: 'popup/main-app',
							exclude: ['common/main', 'common-ui/main']
						},
						{
							name: 'dashboard/main-app',
							exclude: ['common/main', 'common-ui/main']
						}
					]
				}
			}
		},
		copy: {
			dist: {
				options: {
					basePath: "."
				},
				files: {
					'<%= vars.dist %>/': [
						'manifest.json',
						'img/*',
						'bower_components/font-awesome/css/font-awesome.min.css',
						'bower_components/font-awesome/fonts/*',
						'bower_components/requirejs/require.js',
						'bower_components/bootstrap/dist/css/bootstrap.min.css'
					]
				}
			}
		},
		compress: {
			main: {
				options: {
					archive: '<%= vars.dist %>.zip'
				},
				files: [
					{
						src: ['<%= vars.dist %>/**/*']
					}
				]
			}
		},
		plato: {
			all: {
				files: {
					'docs/report': ['src/**/*.js']
				}
			},
			src: {
				files: {
					'docs/report': ['src/**/*.js']
				}
			}
		}
	});

};
