define(['cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var JenkinsBuildService = function (settings) {
			this.cctrayLocation = function (url) {
				return 'cc.xml';
			};
			CCTrayBuildService.apply(this, [settings]);
		};
		
		JenkinsBuildService.prototype = CCTrayBuildService.prototype;

		JenkinsBuildService.settings = function () {
			var settings = CCTrayBuildService.settings();
			settings.typeName = 'Jenkins';
			settings.baseUrl = 'jenkins';
			settings.icon = 'jenkins/icon.png';
			settings.logo = 'jenkins/logo.png';
			return settings;
		};

		return JenkinsBuildService;
	});