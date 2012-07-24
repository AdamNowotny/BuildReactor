/*global module:false*/
module.exports = function (grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		vars: {
			build: 'build',
			dist: 'build/BuildReactor'
		},
		clean: {
			src: [ '<config:vars.build>' ]
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
				waitsFor: true
			}
		},
		mincss: {
			compress: {
				files: {
					'<%= vars.dist %>/css/options.css': [ 'css/options.css' ],
					'<%= vars.dist %>/src/bamboo/options.css': [ 'src/bamboo/options.css' ],
					'<%= vars.dist %>/src/cctray/options.css': [ 'src/cctray/options.css' ]
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: "src",
					dir: 'build/BuildReactor/src',
					removeCombined: true,
					inlineText: true,
					useStrict: true,
					preserveLicenseComments: true,
					optimize: 'uglify',
					optimizeCss: 'none',
					wrap: {
						startFile: 'grunt.startFile.js',
						endFile: 'grunt.endFile.js'
					},
					paths: {
						amdUtils: '../lib/amd-utils',
						bootstrap: 'empty:',
						jquery: 'empty:',
						jqueryTools: 'empty:',
						signals: 'empty:',
						// Handlebars plugin does not like to be in lib folder.
						// Needed to rename to hbs-plugin and specifiy all paths here.
						hbs: '../lib/requirejs/hbs-plugin',
						Handlebars: '../lib/requirejs/Handlebars',
						'hbs/underscore': '../lib/requirejs/hbs/underscore',
						'hbs/i18nprecompile': '../lib/requirejs/hbs/i18nprecompile',
						'hbs/json2': '../lib/requirejs/hbs/json2'
					},
					modules: [
						{
							name: 'main'
						},
						{
							name: 'options'
						},
						{
							name: 'bamboo/settingsController'
						},
						{
							name: 'bamboo/buildService'
						},
						{
							name: 'cctray/settingsController'
						},
						{
							name: 'cctray/buildService'
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
						'manifest.json',
						'img/*',
						'src/bamboo/*.html',
						'src/bamboo/*.png',
						'src/cctray/*.html',
						'src/cctray/*.png',
						'lib/jquery/jquery.js',
						'lib/jquery-tools/jquery.tools.min.js',
						'lib/js-signals/signals.js',
						'lib/requirejs/require.min.js',
						'lib/twitter-bootstrap/css/bootstrap.css',
						'lib/twitter-bootstrap/img/*',
						'lib/twitter-bootstrap/js/bootstrap.min.js'
					]
				}
			}
		},
		jasmine: {
			all: ['spec/specrunner.html']
		}
	});

	// Default task.
	grunt.registerTask('default', 'clean lint jasmine mincss requirejs copy');
	grunt.registerTask('test', 'lint jasmine');
	grunt.registerTask('dist', 'clean mincss requirejs copy');

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-jasmine-task');
};
