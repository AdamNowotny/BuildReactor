/*global module:false*/
module.exports = function (grunt) {

	'use strict';

	grunt.loadNpmTasks('grunt-clear');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-plato');
	grunt.loadNpmTasks('grunt-version');

	grunt.registerTask('default', ['clean:build', 'jshint', 'connect:test', 'jasmine', 'cssmin', 'requirejs', 'copy', 'clean:buildSrc', 'compress']);
	grunt.registerTask('test', ['jshint', 'connect:test', 'jasmine']);
	grunt.registerTask('server', ['jasmine:main:build', 'connect:server']);
	grunt.registerTask('dist', ['clean:build', 'cssmin', 'requirejs', 'copy', 'clean:buildSrc', 'compress']);
	grunt.registerTask('report', ['plato:src']);
	grunt.registerTask('travis', ['clean:build', 'jshint', 'connect:test', 'jasmine']);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		vars: {
			build: '_build',
			dist: '_build/<%= pkg.name %>'
		},
		clean: {
			build: [ '<%= vars.build %>' ],
			buildSrc: [
				'<%= vars.dist %>/src/mout',
				'<%= vars.dist %>/src/options',
				'<%= vars.dist %>/src/popup',
				'<%= vars.dist %>/src/templates',
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
		jasmine: {
			main: {
				options: {
					specs: 'spec/**/*Test.js',
					host: 'http://localhost:8000/',
					vendor: [
						"bower_components/jasmine-jquery/lib/jasmine-jquery.js"
					],
					helpers: [
						"spec/test.js"
					],
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						requireConfig: {
							baseUrl: 'src',
							paths: {
								angular: '../bower_components/angular/angular',
								angularMocks: '../bower_components/angular-mocks/angular-mocks',
								'options/messages': 'options/messages',
								'popup/messages': 'popup/messages',
								bootbox: '../bower_components/bootbox/bootbox',
								bootstrap: '../lib/twitter-bootstrap/js/bootstrap',
								bootstrapToggle: '../lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons',
								fixtures: '../spec/fixtures',
								handlebars: '../lib/require-handlebars-plugin/Handlebars',
								hbs: '../lib/require-handlebars-plugin/hbs-plugin',
								i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
								jasmineSignals: '../bower_components/jasmine-signals/jasmine-signals',
								jquery: '../bower_components/jquery/jquery',
								json: '../bower_components/requirejs-plugins/src/json',
								json2: '../lib/require-handlebars-plugin/hbs/json2',
								mocks: '../spec/mocks',
								mout: '../bower_components/mout/src',
								signals: '../bower_components/js-signals/dist/signals',
								spec: '../spec',
								text: '../bower_components/requirejs-text/text',
								rx: '../bower_components/rxjs/rx',
								rxHelpers: '../spec/rxHelpers',
								'rx.aggregates': '../bower_components/rxjs/rx.aggregates',
								'rx.binding': '../bower_components/rxjs/rx.binding',
								'rx.jquery': '../bower_components/rxjs-jquery/rx.jquery',
								'rx.testing': '../bower_components/rxjs/rx.testing',
								'rx.time': '../bower_components/rxjs/rx.time',
								underscore: '../lib/require-handlebars-plugin/hbs/underscore'
							},
							map: {
								'rx.jquery': {
									'jQuery': 'jquery'
								}
							},
							shim: {
								angular: {
									deps: ['jquery'],
									exports: 'angular'
								},
								bootstrap: [ 'jquery' ],
								bootbox: {
									deps: [ 'bootstrap' ],
									exports: 'bootbox'
								},
								bootstrapToggle: {
									deps: [ 'jquery', 'bootstrap' ]
								},
								jquery: {
									exports: 'jquery'
								}
							},
							hbs: {
								templateExtension: 'html',
								helperDirectory: 'templates/helpers/',
								i18nDirectory:   'templates/i18n/'
							},
							waitSeconds: 10
						}
					}
				}
			}
		},
		connect: {
			test: {
				options: {
					keepalive: false
				}
			},
			server: {
				options: {
					keepalive: true
				}
			}
		},
		watch: {
			options: {
				files: [ 'src/**/*', 'spec/**/*' ],
				tasks: ['clear', 'jasmine'],
				interrupt: true
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
						rx: '../bower_components/rxjs/rx.modern',
						'rx.binding': '../bower_components/rxjs/rx.binding',
						'rx.jquery': '../bower_components/rxjs-jquery/rx.jquery',
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
