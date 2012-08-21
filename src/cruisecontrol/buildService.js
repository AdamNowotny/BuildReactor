define(['cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var CCBuildService = function (settings) {
			this.cctrayLocation = function () {
				return 'cctray.xml';
			};
			CCTrayBuildService.apply(this, [settings]);
		};
		
		CCBuildService.prototype = CCTrayBuildService.prototype;

		CCBuildService.settings = function () {
			var settings = CCTrayBuildService.settings();
			settings.typeName = 'CruiseControl';
			settings.baseUrl = 'cruisecontrol';
			settings.icon = 'cruisecontrol/icon.png';
			settings.logo = 'cruisecontrol/logo.png';
			return settings;
		};

		return CCBuildService;
	});