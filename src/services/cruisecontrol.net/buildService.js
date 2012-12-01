define(['services/cctray/buildService', 'jquery'], function (CCTrayBuildService, $) {

		'use strict';

		var CcnetBuildService = function (settings) {
			$.extend(this, new CCTrayBuildService(settings));
			this.cctrayLocation = 'XmlStatusReport.aspx';
		};
		
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