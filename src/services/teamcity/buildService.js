define(['services/cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var GoBuildService = function (settings) {
			this.cctrayLocation = function () {
				return 'guestAuth/app/rest/cctray/projects.xml';
			};
			CCTrayBuildService.apply(this, [settings]);
		};
		
		GoBuildService.prototype = CCTrayBuildService.prototype;

		GoBuildService.settings = function () {
			return {
				typeName: 'TeamCity 7+',
				baseUrl: 'teamcity',
				icon: 'teamcity/icon.png',
				logo: 'teamcity/logo.png',
				projects: [],
				urlHint: 'http://teamcity.jetbrains.com/'
			};
		};

		return GoBuildService;
	});