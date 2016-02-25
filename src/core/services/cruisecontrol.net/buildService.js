define([
	'core/services/cctray/buildService',
	'mout/object/mixIn'
], function(CCTrayBuildService, mixIn) {

	'use strict';

	var CcnetBuildService = function(settings) {
		mixIn(this, new CCTrayBuildService(settings, CcnetBuildService.settings()));
		this.cctrayLocation = 'XmlStatusReport.aspx';
	};
	
	CcnetBuildService.settings = function() {
		return {
			typeName: 'CruiseControl.NET',
			baseUrl: 'cruisecontrol.net',
			urlHint: 'URL, e.g. http://build.nauck-it.de/',
			icon: 'core/services/cruisecontrol.net/icon.png',
			logo: 'core/services/cruisecontrol.net/logo.png',
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
