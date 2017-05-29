define([
	'core/services/cctray/buildService'
], function(CCTrayBuildService) {

	'use strict';

	var CcrbBuildService = function(settings) {
		Object.assign(this, new CCTrayBuildService(settings, CcrbBuildService.settings()));
		this.cctrayLocation = 'XmlStatusReport.aspx';
	};

	CcrbBuildService.settings = function() {
		return {
			typeName: 'CruiseControl.rb',
			baseUrl: 'cruisecontrol.rb',
			icon: 'core/services/cruisecontrol.rb/icon.png',
			logo: 'core/services/cruisecontrol.rb/logo.png',
			defaultConfig: {
				baseUrl: 'cruisecontrol.rb',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		};
	};

	return CcrbBuildService;
});
