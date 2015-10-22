define([
	'core/services/cctray/buildService',
	'mout/object/mixIn'
], function (CCTrayBuildService, mixIn) {

	'use strict';

	var CcnetBuildService = function (settings) {
		mixIn(this, new CCTrayBuildService(settings));
		this.cctrayLocation = 'XmlStatusReport.aspx';
	};
	
	CcnetBuildService.settings = function () {
		return {
			typeName: 'CruiseControl.NET',
			baseUrl: 'cruisecontrol.net',
			icon: 'cruisecontrol.net/icon.png',
			logo: 'cruisecontrol.net/logo.png',
			urlHint: 'URL, e.g. http://build.nauck-it.de/',
			defaultConfig: {
				baseUrl: 'cruisecontrol.net',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		};
	};

	return CcnetBuildService;
});