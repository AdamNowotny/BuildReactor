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
			return {
				typeName: 'CruiseControl.NET',
				baseUrl: 'cruisecontrol.net',
				icon: 'cruisecontrol.net/icon.png',
				logo: 'cruisecontrol.net/logo.png',
				projects: [],
				urlHint: 'http://build.nauck-it.de/'
			};
		};

		return CcnetBuildService;
	});