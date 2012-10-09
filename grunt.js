/*global module:false*/
module.exports = function (grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		vars: {
			build: '_build',
			dist: '_build/BuildReactor'
		},
		clean: {
			src: [ '<%= vars.build %>' ]
		},
		lint: {
			files: ['src/**/*.js', 'spec/**/*.js']
		},
		jshint: {
			options: {
				bitwise: true,
				curly: true,
				eqeqeq: true,
				forin: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				nonew: true,
				plusplus: false,
				regexp: true,
				undef: true,
				strict: true,
				trailing: true,

				es5: true,
				sub: true,

				browser: true,
				devel: true,

				white: true
			},
			globals: {
				afterEach: true,
				beforeEach: true,
				chrome: true,
				define: true,
				describe: true,
				expect: true,
				it: true,
				jasmine: true,
				loadFixtures: true,
				require: true,
				runs: true,
				spyOn: true,
				waitsFor: true,
				xit: true
			}
		},
		jasmine: {
			all: ['spec/specrunner.html']
		},
		mincss: {
			compress: {
				files: {
					'<%= vars.dist %>/css/options.css': [ 'css/options.css' ],
					'<%= vars.dist %>/css/popup.css': [ 'css/popup.css' ]
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
					// optimize: 'none',
					optimizeCss: 'none',
					uglify: {
						toplevel: true,
						max_line_length: 200
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
					has: {
						debug: false
					},
					paths: {
						amdUtils: '../lib/amd-utils',
						has: '../lib/requirejs/has',
						bootstrap: 'empty:',
						jquery: 'empty:',
						jqueryTools: 'empty:',
						signals: 'empty:',
						urljs: 'empty:',
						// Handlebars plugin does not like to be in lib folder.
						// Needed to rename to hbs-plugin and specifiy all paths here.
						hbs: '../lib/requirejs/hbs-plugin',
						Handlebars: '../lib/requirejs/Handlebars',
						'hbs/underscore': '../lib/requirejs/hbs/underscore',
						'hbs/i18nprecompile': '../lib/requirejs/hbs/i18nprecompile',
						'hbs/json2': '../lib/requirejs/hbs/json2'
					},
					hbs: {
						helperDirectory: 'templates/helpers/',
						i18nDirectory:   'templates/i18n/'
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
							name: 'options',
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
					'<%= vars.dist %>': [
						'background.html',
						'options.html',
						'popup.html',
						'manifest.json',
						'img/exclamation.png',
						'img/feedback.png',
						'img/icon.svg',
						'img/icon-16.png',
						'img/icon-19.png',
						'img/icon-48.png',
						'img/icon-128.png',
						'img/loading.gif',
						'img/tool.png',
						'lib/jquery/jquery-1.8.2.min.js',
						'lib/jquery-tools/jquery.tools.min.js',
						'lib/js-signals/signals.js',
						'lib/requirejs/require.min.js',
						'lib/twitter-bootstrap/css/bootstrap.css',
						'lib/twitter-bootstrap/img/*',
						'lib/twitter-bootstrap/js/bootstrap.min.js',
						'lib/urljs/url-min.js'
					]
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'clean lint jasmine mincss requirejs copy');
	grunt.registerTask('travis', 'clean lint jasmine');
	grunt.registerTask('test', 'lint jasmine');
	grunt.registerTask('dist', 'clean mincss requirejs copy');

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-jasmine-task');
};
