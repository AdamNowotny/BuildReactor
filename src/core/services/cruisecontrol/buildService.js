define([
	'core/services/cctray/buildService'
], function(CCTrayBuildService) {

	'use strict';

	var CCBuildService = function(settings) {
		Object.assign(this, new CCTrayBuildService(settings, CCBuildService.settings()));
		this.cctrayLocation = 'cctray.xml';
	};

	CCBuildService.settings = function() {
		return {
			typeName: 'CruiseControl',
			baseUrl: 'cruisecontrol',
			icon: 'core/services/cruisecontrol/icon.png',
			logo: 'core/services/cruisecontrol/logo.png',
			defaultConfig: {
				baseUrl: 'cruisecontrol',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		};
	};

	return CCBuildService;
});
