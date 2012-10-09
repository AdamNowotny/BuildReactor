define(['services/cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var CcrbBuildService = function (settings) {
			this.cctrayLocation = function () {
				return 'XmlStatusReport.aspx';
			};
			CCTrayBuildService.apply(this, [settings]);
		};
		
		CcrbBuildService.prototype = CCTrayBuildService.prototype;

		CcrbBuildService.settings = function () {
			var settings = CCTrayBuildService.settings();
			settings.typeName = 'CruiseControl.rb';
			settings.baseUrl = 'cruisecontrol.rb';
			settings.icon = 'cruisecontrol.rb/icon.png';
			settings.logo = 'cruisecontrol.rb/logo.png';
			return settings;
		};

		return CcrbBuildService;
	});