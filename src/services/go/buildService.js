define(['services/cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var GoBuildService = function (settings) {
			var cctraySettings = createCCTraySettings(settings);
			CCTrayBuildService.apply(this, [cctraySettings]);
		};
		
		GoBuildService.prototype = CCTrayBuildService.prototype;

		function createCCTraySettings(settings) {
			var cctraySettings = GoBuildService.settings();
			cctraySettings.name = settings.name;
			cctraySettings.url = settings.url + 'cctray.xml';
			cctraySettings.updateInterval = settings.updateInterval;
			cctraySettings.projects = settings.projects;
			cctraySettings.icon = settings.icon;
			return cctraySettings;
		}

		GoBuildService.settings = function () {
			return {
				typeName: 'ThoughtWorks GO',
				baseUrl: 'go',
				icon: 'go/icon.png',
				logo: 'go/logo.png',
				projects: []
			};
		};

		return GoBuildService;
	});