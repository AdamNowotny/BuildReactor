define([
		'cctray/buildService'
	], function (CCTrayBuildService) {

		'use strict';

		var CCBuildService = function (settings) {
			var cctraySettings = createCCTraySettings(settings);
			CCTrayBuildService.apply(this, [cctraySettings]);
		};
		
		CCBuildService.prototype = CCTrayBuildService.prototype;

		function createCCTraySettings(settings) {
			var cctraySettings = CCBuildService.settings();
			cctraySettings.name = settings.name;
			cctraySettings.url = settings.url + 'cctray.xml';
			cctraySettings.updateInterval = settings.updateInterval;
			cctraySettings.projects = settings.projects;
			cctraySettings.icon = settings.icon;
			return cctraySettings;
		}

		CCBuildService.settings = function () {
			return {
				typeName: 'CruiseControl',
				baseUrl: 'cruisecontrol',
				icon: 'cruisecontrol/icon.png',
				logo: 'cruisecontrol/logo.png',
				projects: []
			};
		};

		return CCBuildService;
	});