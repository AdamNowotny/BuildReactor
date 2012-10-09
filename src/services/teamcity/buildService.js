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
			var settings = CCTrayBuildService.settings();
			settings.typeName = 'TeamCity 7+';
			settings.baseUrl = 'teamcity';
			settings.icon = 'teamcity/icon.png';
			settings.logo = 'teamcity/logo.png';
			return settings;
		};

		return GoBuildService;
	});