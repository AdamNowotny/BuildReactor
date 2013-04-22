define(['services/cctray/buildService', 'mout/object/mixIn'], function (CCTrayBuildService, mixIn) {

	'use strict';

	var CCBuildService = function (settings) {
		mixIn(this, new CCTrayBuildService(settings));
		this.cctrayLocation = 'cctray.xml';
	};
	
	CCBuildService.settings = function () {
		return {
			typeName: 'CruiseControl',
			baseUrl: 'cruisecontrol',
			icon: 'cruisecontrol/icon.png',
			logo: 'cruisecontrol/logo.png',
			projects: [],
			url: '',
			urlHint: 'http://cruisecontrol.instance.com/',
			username: '',
			password: '',
			updateInterval: 60
		};
	};

	return CCBuildService;
});