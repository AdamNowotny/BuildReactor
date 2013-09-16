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

	grunt.registerTask('default', ['clean:build', 'jshint', 'karma:once', 'cssmin', 'requirejs', 'copy', 'clean:buildSrc', 'compress']);
	grunt.registerTask('test', ['karma:watch']);
	grunt.registerTask('dist', ['clean:build', 'cssmin', 'requirejs', 'copy', 'clean:buildSrc', 'compress']);
	grunt.registerTask('report', ['plato:src']);
	grunt.registerTask('travis', ['clean:build', 'jshint', 'karma:once']);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		vars: {
			build: '_build',
			dist: '_build/<%= pkg.name %>'
		},
		clean: {
			build: [ '<%= vars.build %>' ],
			buildSrc: [
				'<%= vars.dist %>/src/**/*.spec.js',
				'<%= vars.dist %>/src/**/*.fixture.*',
				'<%= vars.dist %>/src/common',
				'<%= vars.dist %>/src/main',
				'<%= vars.dist %>/src/mout',
				'<%= vars.dist %>/src/options',
				'<%= vars.dist %>/src/templates',
				'<%= vars.dist %>/src/test',
				'<%= vars.dist %>/src/test-karma.js',
				'<%= vars.dist %>/src/build.txt'
			]
		},
		jshint: {
			files: ['src/**/*.js', 'spec/**/*.js'],
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
				configFile: 'karma.conf.js'
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
					'<%= vars.dist %>/src/css/options.css': [ 'src/css/options.css'	],
					'<%= vars.dist %>/src/css/popup.css': [ 'src/css/popup.css' ],
					'<%= vars.dist %>/src/css/dashboard.css': [ 'src/css/dashboard.css' ]
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
					optimizeCss: 'standard',
					uglify: {
						toplevel: true,
						max_line_length: 100
					},
					wrap: {
						startFile: 'grunt.startFile.js',
						endFile: 'grunt.endFile.js'
					},
					pragmasOnSave: {
						//removes Handlebars.Parser code (used to compile template strings) set
						//it to `false` if you need to parse template strings even after build
						excludeHbsParser : true,
						// kills the entire plugin set once it's built.
						excludeHbs: true,
						// removes i18n precompiler, handlebars and json2
						excludeAfterBuild: true
					},
					paths: {
						angular: 'empty:',
						bootbox: 'empty:',
						bootstrap: 'empty:',
						bootstrapToggle: 'empty:',
						handlebars: '../lib/require-handlebars-plugin/Handlebars',
						hbs: '../lib/require-handlebars-plugin/hbs-plugin',
						i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
						jquery: 'empty:',
						json2: '../lib/require-handlebars-plugin/hbs/json2',
						mout: '../bower_components/mout/src',
						'options/messages': 'options/messages',
						'popup/messages': 'popup/messages',
						rx: '../bower_components/Rx/rx.modern',
						'rx.binding': '../bower_components/Rx/rx.binding',
						'rx.jquery': '../bower_components/Rx-jQuery/rx.jquery',
						'rx.time': '../bower_components/Rx/rx.time',
						signals: '../bower_components/js-signals/dist/signals',
						underscore: '../lib/require-handlebars-plugin/hbs/underscore'
					},
					hbs: {
						templateExtension: 'html',
						helperDirectory: 'templates/helpers/',
						i18nDirectory:   'templates/i18n/'
					},
					shim: {
						angular: {
							deps: ['jquery'],
							exports: 'angular'
						},
						bootbox: {
							deps: [ 'jquery', 'bootstrap' ],
							exports: 'bootbox'
						},
						bootstrapToggle: {
							deps: [ 'jquery', 'bootstrap' ]
						}
					},
					modules: [
						{
							name: 'rxjs',
							include: [
								'rx',
								'rx.jquery',
								'rx.time'
							],
							override: {
								map: {
									'rx.jquery': {
										'jQuery': 'jquery'
									}
								}
							}
						},
						{
							name: 'main',
							exclude: [
								'rxjs'
							]
						},
						{
							name: 'options',
							exclude: [
								'rxjs'
							]
						},
						{
							name: 'popup',
							exclude: [
								'rxjs'
							]
						},
						{
							name: 'dashboard',
							exclude: [
								'rxjs'
							]
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
						'options.html',
						'popup.html',
						'dashboard.html',
						'manifest.json',
						'src/img/*',
						'bower_components/angular/angular.min.js',
						'bower_components/bootbox/bootbox.min.js',
						'lib/bootstrap-toggle-buttons/stylesheets/bootstrap-toggle-buttons.css',
						'lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons.js',
						'bower_components/jquery/jquery.min.js',
						'bower_components/requirejs/require.js',
						'bower_components/font-awesome/css/font-awesome.min.css',
						'bower_components/font-awesome/font/*',
						'lib/twitter-bootstrap/css/bootstrap.css',
						'lib/twitter-bootstrap/img/*',
						'lib/twitter-bootstrap/js/bootstrap.min.js'
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
					'docs/report': ['src/**/*.js', 'spec/**/*.js']
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
