define(['cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var CcnetBuildService = function (settings) {
			var cctraySettings = createCCTraySettings(settings);
			CCTrayBuildService.apply(this, [cctraySettings]);
		};
		
		CcnetBuildService.prototype = CCTrayBuildService.prototype;

		function createCCTraySettings(settings) {
			var cctraySettings = CcnetBuildService.settings();
			cctraySettings.name = settings.name;
			cctraySettings.url = settings.url + 'XmlStatusReport.aspx';
			cctraySettings.updateInterval = settings.updateInterval;
			cctraySettings.projects = settings.projects;
			cctraySettings.icon = settings.icon;
			return cctraySettings;
		}

		CcnetBuildService.settings = function () {
			return {
				typeName: 'CruiseControl.NET',
				baseUrl: 'cruisecontrol.net',
				icon: 'cruisecontrol.net/icon.png',
				logo: 'cruisecontrol.net/logo.png',
				projects: []
			};
		};

		return CcnetBuildService;
	});