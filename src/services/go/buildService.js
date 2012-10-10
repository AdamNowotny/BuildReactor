define(['services/cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var GoBuildService = function (settings) {
			this.cctrayLocation = function () {
				return 'cctray.xml';
			};
			CCTrayBuildService.apply(this, [settings]);
		};
		
		GoBuildService.prototype = CCTrayBuildService.prototype;

		GoBuildService.settings = function () {
			return {
				typeName: 'ThoughtWorks GO',
				baseUrl: 'go',
				icon: 'go/icon.png',
				logo: 'go/logo.png',
				projects: [],
				urlHint: 'http://example-go.thoughtworks.com/'
			};
		};

		return GoBuildService;
	});