define(['services/cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var CcnetBuildService = function (settings) {
			this.cctrayLocation = function () {
				return 'XmlStatusReport.aspx';
			};
			CCTrayBuildService.apply(this, [settings]);
		};
		
		CcnetBuildService.prototype = CCTrayBuildService.prototype;

		CcnetBuildService.settings = function () {
			var settings = CCTrayBuildService.settings();
			settings.typeName = 'CruiseControl.NET';
			settings.baseUrl = 'cruisecontrol.net';
			settings.icon = 'cruisecontrol.net/icon.png';
			settings.logo = 'cruisecontrol.net/logo.png';
			return settings;
		};

		return CcnetBuildService;
	});