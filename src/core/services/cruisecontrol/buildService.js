define([
	'core/services/cctray/buildService',
	'mout/object/mixIn'
], function(CCTrayBuildService, mixIn) {

	'use strict';

	var CCBuildService = function(settings) {
		mixIn(this, new CCTrayBuildService(settings, CCBuildService.settings()));
		this.cctrayLocation = 'cctray.xml';
	};
	
	CCBuildService.settings = function() {
		return {
			typeName: 'CruiseControl',
			baseUrl: 'cruisecontrol',
			urlHint: 'URL, e.g. http://cruisecontrol.instance.com/',
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
