/*global module:false*/
module.exports = function (grunt) {

	'use strict';

	grunt.loadNpmTasks('grunt-clear');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-mincss');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-jsvalidate');
	grunt.loadNpmTasks('grunt-jasmine-runner');

	grunt.registerTask('default', 'clean jsvalidate lint jasmine mincss requirejs copy');
	grunt.registerTask('travis', 'clean jsvalidate lint jasmine');
	grunt.registerTask('test', 'lint jasmine');
	grunt.registerTask('dist', 'clean mincss requirejs copy');

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
		jsvalidate: {
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
				readFixtures: true,
				require: true,
				runs: true,
				spyOn: true,
				waitsFor: true,
				xit: true
			}
		},
		jasmine: {
			specs: 'spec/**/*Test.js',
			amd: true,
			helpers: [
				"components/jasmine-jquery/lib/jasmine-jquery.js",
				"components/requirejs/require.js",
				"spec/test.js"
			],
			template: {
				src: 'spec/SpecRunner.tmpl',
				opts: {}
			},
			timeout: 3000,
			phantomjs: {
				"ignore-ssl-errors": true
			}
		},
		watch: {
			clear: {
				files: [ 'src/**/*', 'spec/**/*' ],
				tasks: ["clear"]
			},
			files: [ 'src/**/*', 'spec/**/*' ],
			tasks: 'jasmine'
		},
		mincss: {
			compress: {
				files: {
					'<%= vars.dist %>/css/options.css': [
						'css/addService.css',
						'css/alert.css',
						'css/options.css',
						'css/serviceList.css',
						'css/serviceSettings.css'
					],
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
						amdUtils: '../components/amd-utils/src',
						bootstrap: 'empty:',
						jquery: 'empty:',
						signals: '../components/js-signals/dist/signals',
						hbs: '../lib/require-handlebars-plugin/hbs-plugin',
						handlebars: '../lib/require-handlebars-plugin/Handlebars',
						underscore: '../lib/require-handlebars-plugin/hbs/underscore',
						i18nprecompile: '../lib/require-handlebars-plugin/hbs/i18nprecompile',
						json2: '../lib/require-handlebars-plugin/hbs/json2',
						rx: '../lib/rx/rx'
					},
					hbs: {
						templateExtension: 'html',
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
						'manifest.json',
						'img/*',
						'components/jquery/jquery.js',
						'components/requirejs/require.js',
						'lib/twitter-bootstrap/css/bootstrap.css',
						'lib/twitter-bootstrap/img/*',
						'lib/twitter-bootstrap/js/bootstrap.min.js'
					]
				}
			}
		}
	});

};
