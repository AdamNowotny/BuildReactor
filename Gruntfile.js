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

	grunt.registerTask('default', ['clean:build', 'jshint', 'connect:test', 'jasmine', 'cssmin', 'requirejs', 'copy', 'clean:buildSrc', 'compress']);
	grunt.registerTask('test', ['jshint', 'connect:test', 'jasmine']);
	grunt.registerTask('server', ['jasmine:main:build', 'connect:server']);
	grunt.registerTask('dist', ['clean:build', 'cssmin', 'requirejs', 'copy', 'clean:buildSrc']);
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
				jshintrc: '.jshintrc',
			}
		},
		jasmine: {
			main: {
				options: {
					specs: 'spec/**/*Test.js',
					host: 'http://localhost:8000/',
					vendor: [
						"components/jasmine-jquery/lib/jasmine-jquery.js"
					],
					helpers: [
						"spec/test.js"
					],
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						requireConfig: {
							baseUrl: './src',
							paths: {
								'options/messages': 'options/messages',
								'popup/messages': 'popup/messages',
								bootbox: '../components/bootbox/bootbox',
								bootstrap: '../lib/twitter-bootstrap/js/bootstrap',
								bootstrapToggle: '../lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons',
								fixtures: '../spec/fixtures',
								handlebars: '../lib/require-handlebars-plugin/Handlebars',
								hbs: '../lib/require-handlebars-plugin/hbs-plugin',
								i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
								jasmineSignals: '../components/jasmine-signals/jasmine-signals',
								jquery: '../components/jquery/jquery',
								json: '../components/requirejs-plugins/src/json',
								json2: '../lib/require-handlebars-plugin/hbs/json2',
								mocks: '../spec/mocks',
								mout: '../components/mout/src',
								signals: '../components/js-signals/dist/signals',
								spec: '../spec',
								text: '../components/requirejs-text/text',
								rx: '../components/rxjs/rx',
								rxHelpers: '../spec/rxHelpers',
								'rx.aggregates': '../components/rxjs/rx.aggregates',
								'rx.binding': '../components/rxjs/rx.binding',
								'rx.jquery': '../components/rxjs-jquery/rx.jquery',
								'rx.testing': '../components/rxjs/rx.testing',
								'rx.time': '../components/rxjs/rx.time',
								underscore: '../lib/require-handlebars-plugin/hbs/underscore'
							},
							map: {
								'rx.jquery': {
									'jQuery': 'jquery'
								}
							},
							shim: {
								jquery: {
									exports: 'jquery'
								},
								bootstrap: [ 'jquery' ],
								bootbox: {
									deps: [ 'bootstrap' ],
									exports: 'bootbox'
								},
								bootstrapToggle: {
									deps: [ 'jquery', 'bootstrap' ]
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
					'<%= vars.dist %>/css/options.css': [
						'css/options.css',
						'css/addService.css',
						'css/alert.css',
						'css/serviceList.css',
						'css/serviceSettings.css'
					],
					'<%= vars.dist %>/css/popup.css': [ 'css/popup.css' ],
					'<%= vars.dist %>/css/dashboard.css': [ 'css/popup.css', 'css/dashboard.css' ]
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
					// optimizeCss: 'standard',
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
						bootbox: 'empty:',
						bootstrap: 'empty:',
						bootstrapToggle: 'empty:',
						handlebars: '../lib/require-handlebars-plugin/Handlebars',
						hbs: '../lib/require-handlebars-plugin/hbs-plugin',
						i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
						jquery: 'empty:',
						json2: '../lib/require-handlebars-plugin/hbs/json2',
						mout: '../components/mout/src',
						'options/messages': 'options/messages',
						'popup/messages': 'popup/messages',
						rx: '../components/rxjs/rx.modern',
						'rx.binding': '../components/rxjs/rx.binding',
						'rx.jquery': '../components/rxjs-jquery/rx.jquery',
						'rx.time': '../components/rxjs/rx.time',
						signals: '../components/js-signals/dist/signals',
						underscore: '../lib/require-handlebars-plugin/hbs/underscore'
					},
					hbs: {
						templateExtension: 'html',
						helperDirectory: 'templates/helpers/',
						i18nDirectory:   'templates/i18n/'
					},
					shim: {
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
						'img/*',
						'components/bootbox/bootbox.min.js',
						'lib/bootstrap-toggle-buttons/stylesheets/bootstrap-toggle-buttons.css',
						'lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons.js',
						'components/jquery/jquery.min.js',
						'components/requirejs/require.js',
						'components/font-awesome/css/font-awesome.min.css',
						'components/font-awesome/font/*',
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
					archive: '<%= vars.build %>/<%= pkg.name %>.zip'
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
