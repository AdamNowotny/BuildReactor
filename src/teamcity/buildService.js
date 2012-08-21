define(['cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var GoBuildService = function (settings) {
			var cctraySettings = createCCTraySettings(settings);
			CCTrayBuildService.apply(this, [cctraySettings]);
		};
		
		GoBuildService.prototype = CCTrayBuildService.prototype;

		function createCCTraySettings(settings) {
			var cctraySettings = GoBuildService.settings();
			cctraySettings.name = settings.name;
			cctraySettings.url = settings.url + 'guestAuth/app/rest/cctray/projects.xml';
			cctraySettings.updateInterval = settings.updateInterval;
			cctraySettings.projects = settings.projects;
			cctraySettings.icon = settings.icon;
			return cctraySettings;
		}

		GoBuildService.settings = function () {
			return {
				typeName: 'TeamCity 7+',
				baseUrl: 'teamcity',
				icon: 'teamcity/icon.png',
				logo: 'teamcity/logo.png',
				projects: []
			};
		};

		return GoBuildService;
	});