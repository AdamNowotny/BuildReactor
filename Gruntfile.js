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
				'<%= vars.dist %>/src/templates',
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
						start: "/*\n<%= vars.license %>\n*/\n(function() {",
						end: "}());"
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
						angular: '../bower_components/angular/angular',
						'angular.route': '../bower_components/angular-route/angular-route',
						bootbox: '../bower_components/bootbox/bootbox',
						bootstrap: '../lib/twitter-bootstrap/js/bootstrap',
						bootstrapToggle: '../lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons',
						'common/core': 'common/core',
						handlebars: '../lib/require-handlebars-plugin/Handlebars',
						hbs: '../lib/require-handlebars-plugin/hbs-plugin',
						i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
						jquery: "../bower_components/jquery/jquery",
						json2: '../lib/require-handlebars-plugin/hbs/json2',
						mout: '../bower_components/mout/src',
						rx: '../bower_components/rxjs/rx',
						'rx.async': '../bower_components/rxjs/rx.async',
						'rx.binding': '../bower_components/rxjs/rx.binding',
						'rx.time': '../bower_components/rxjs/rx.time',
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
						'angular.route': ['angular'],
						bootstrap: [ 'jquery' ],
						bootbox: {
							deps: [ 'jquery', 'bootstrap' ],
							exports: 'bootbox'
						},
						bootstrapToggle: [ 'jquery', 'bootstrap' ]
					},
					modules: [
						{
							name: 'common/main'
						},
						{
							name: 'common/main-web',
							exclude: ['common/main']
						},
						{
							name: 'core/main',
							exclude: ['common/main', 'common/main-web']
						},
						{
							name: 'options/main',
							include: ['options/main-app'],
							exclude: ['common/main', 'common/main-web']
						},
						{
							name: 'popup/main',
							include: ['popup/main-app'],
							exclude: ['common/main', 'common/main-web']
						},
						{
							name: 'dashboard/main',
							include: ['dashboard/main-app'],
							exclude: ['common/main', 'common/main-web']
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
						'bower_components/angular/angular-csp.css',
						'bower_components/font-awesome/css/font-awesome.min.css',
						'bower_components/font-awesome/fonts/*',
						'bower_components/requirejs/require.js',
						'lib/bootstrap-toggle-buttons/stylesheets/bootstrap-toggle-buttons.css',
						'lib/twitter-bootstrap/css/bootstrap.css',
						'lib/twitter-bootstrap/img/*'
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
