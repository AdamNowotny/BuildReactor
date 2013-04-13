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
	grunt.loadNpmTasks('grunt-contrib-mincss');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-plato');

	grunt.registerTask('default', ['jshint', 'connect:test', 'jasmine', 'mincss', 'requirejs', 'copy', 'compress']);
	grunt.registerTask('test', ['connect:test', 'jasmine']);
	grunt.registerTask('server', ['connect:server']);
	grunt.registerTask('dist', ['clean', 'mincss', 'requirejs', 'copy']);
	grunt.registerTask('report', ['plato:src']);
	grunt.registerTask('travis', ['clean', 'jshint', 'connect:test', 'jasmine']);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		vars: {
			build: '_build',
			dist: '_build/<%= pkg.name %>'
		},
		clean: {
			src: '<%= vars.build %>'
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
								messages: 'options/messagesStatic',
								bootbox: '../components/bootbox/bootbox',
								mout: '../components/mout/src',
								bootstrap: '../lib/twitter-bootstrap/js/bootstrap',
								fixtures: '../spec/fixtures',
								jasmineSignals: '../components/jasmine-signals/jasmine-signals',
								jquery: '../components/jquery/jquery',
								json: '../components/requirejs-plugins/src/json',
								mocks: '../spec/mocks',
								spec: '../spec',
								signals: '../components/js-signals/dist/signals',
								text: '../components/requirejs-text/text',
								hbs: '../lib/require-handlebars-plugin/hbs-plugin',
								handlebars: '../lib/require-handlebars-plugin/Handlebars',
								underscore: '../lib/require-handlebars-plugin/hbs/underscore',
								i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
								json2: '../lib/require-handlebars-plugin/hbs/json2',
								rx: '../lib/rx/rx.min',
								'rx.jquery': '../lib/rx/rx.jquery',
								'rx.time': '../lib/rx/rx.time.min',
								bootstrapToggle: '../lib/bootstrap-toggle-buttons/js/jquery.toggle.buttons'
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
							waitSeconds: 2
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
		mincss: {
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
						'options/messages': 'options/messages',
						'popup/messages': 'popup/messages',
						mout: '../components/mout/src',
						bootbox: 'empty:',
						bootstrap: 'empty:',
						jquery: 'empty:',
						signals: '../components/js-signals/dist/signals',
						hbs: '../lib/require-handlebars-plugin/hbs-plugin',
						handlebars: '../lib/require-handlebars-plugin/Handlebars',
						underscore: '../lib/require-handlebars-plugin/hbs/underscore',
						i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
						json2: '../lib/require-handlebars-plugin/hbs/json2',
						rx: '../components/rxjs/rx',
						'rx.time': '../components/rxjs/rx.time',
						'rx.jquery': '../components/rxjs-jquery/rx.jquery',
						bootstrapToggle: 'empty:'
					},
					map: {
						'rx.jquery': {
							'jQuery': 'jquery'
						}
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
							name: 'main',
							include: [
								'services/bamboo/buildService',
								'services/cctray/buildService',
								'services/cruisecontrol/buildService',
								'services/cruisecontrol.net/buildService',
								'services/cruisecontrol.rb/buildService',
								'services/jenkins/buildService',
								'services/go/buildService',
								'services/teamcity/buildService'
							]
						},
						{
							name: 'options'
						},
						{
							name: 'popup'
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
						'components/jquery/jquery.js',
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
