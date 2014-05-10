/*global module:false*/
module.exports = function (grunt) {

	'use strict';

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-plato');
	grunt.loadNpmTasks('grunt-version');

	grunt.registerTask('default', ['clean:build', 'jshint', 'karma:once', 'requirejs', 'cssmin', 'copy', 'clean:buildSrc', 'compress']);
	grunt.registerTask('test', ['karma:watch']);
	grunt.registerTask('dist', ['clean:build', 'requirejs', 'cssmin', 'copy', 'clean:buildSrc', 'compress']);
	grunt.registerTask('report', ['plato:src']);
	grunt.registerTask('travis', ['clean:build', 'jshint', 'karma:once']);

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
				'<%= vars.dist %>/src/**/*.spec.js',
				'<%= vars.dist %>/src/**/*.fixture.*',
				'<%= vars.dist %>/src/**/*.mock.*',
				'<%= vars.dist %>/src/mout',
				'<%= vars.dist %>/src/test',
				'<%= vars.dist %>/src/build.txt'
			]
		},
		jshint: {
			files: ['src/**/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		version: {
			patch: {
				src: ['manifest.json', 'bower.json']
			}
		},
		/**
		 * The Karma configurations.
		 */
		karma: {
			options: {
				configFile: 'src/test/karma.conf.js'
			},
			once: {
				singleRun: true
			},
			watch: {
				singleRun: false
			}
		},
		cssmin: {
			compress: {
				files: {
					'<%= vars.dist %>/src/settings/main.css': [ 'src/settings/main.css'	],
					'<%= vars.dist %>/src/popup/main.css': [ 'src/popup/main.css' ],
					'<%= vars.dist %>/src/dashboard/main.css': [ 'src/dashboard/main.css' ]
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: "src",
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
						jquery: "../bower_components/jquery/dist/jquery",
						mout: '../bower_components/mout/src',
						rx: '../bower_components/rxjs/rx',
						'rx.async': '../bower_components/rxjs/rx.async',
						'rx.binding': '../bower_components/rxjs/rx.binding',
						'rx.time': '../bower_components/rxjs/rx.time',

						angular: '../bower_components/angular/angular',
						'angular.route': '../bower_components/angular-route/angular-route',
						'angular.ui': '../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
						'angular.ui.utils': '../bower_components/angular-ui-utils/ui-utils',
						bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
						'rx.angular': '../bower_components/angular-rx/rx.angular',

						'common/core': 'common/core'
					},
					shim: {
						angular: {
							deps: ['jquery'],
							exports: 'angular'
						},
						'angular.route': ['angular'],
						'angular.ui': ['angular'],
						'angular.ui.utils': ['angular'],
						bootstrap: [ 'jquery' ],
						'rx.angular': [ 'angular', 'rx' ]
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
