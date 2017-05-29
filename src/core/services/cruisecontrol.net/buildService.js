define([
	'core/services/cctray/buildService'
], function(CCTrayBuildService) {

	'use strict';

	var CcnetBuildService = function(settings) {
		Object.assign(this, new CCTrayBuildService(settings, CcnetBuildService.settings()));
		this.cctrayLocation = 'XmlStatusReport.aspx';
	};

	CcnetBuildService.settings = function() {
		return {
			typeName: 'CruiseControl.NET',
			baseUrl: 'cruisecontrol.net',
			icon: 'core/services/cruisecontrol.net/icon.png',
			logo: 'core/services/cruisecontrol.net/logo.png',
			fields: [
				{ type: 'url', name: 'Server URL, e.g. http://build.nauck-it.de/' },
				{ type: 'username' },
                { type: 'password' }
            ],
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
