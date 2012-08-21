define(['cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var JenkinsBuildService = function (settings) {
			var cctraySettings = createCCTraySettings(settings);
			CCTrayBuildService.apply(this, [cctraySettings]);
		};
		
		JenkinsBuildService.prototype = CCTrayBuildService.prototype;

		function createCCTraySettings(settings) {
			var cctraySettings = JenkinsBuildService.settings();
			cctraySettings.name = settings.name;
			cctraySettings.url = settings.url + 'cc.xml';
			cctraySettings.updateInterval = settings.updateInterval;
			cctraySettings.projects = settings.projects;
			cctraySettings.icon = settings.icon;
			return cctraySettings;
		}

		JenkinsBuildService.settings = function () {
			return {
				typeName: 'Jenkins',
				baseUrl: 'jenkins',
				icon: 'jenkins/icon.png',
				logo: 'jenkins/logo.png',
				projects: []
			};
		};

		return JenkinsBuildService;
	});