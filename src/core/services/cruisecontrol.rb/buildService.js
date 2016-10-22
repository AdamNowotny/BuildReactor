define([
	'core/services/cctray/buildService',
	'mout/object/mixIn'
], function(CCTrayBuildService, mixIn) {

	'use strict';

	var CcrbBuildService = function(settings) {
		mixIn(this, new CCTrayBuildService(settings, CcrbBuildService.settings()));
		this.cctrayLocation = 'XmlStatusReport.aspx';
	};
	
	CcrbBuildService.settings = function() {
		return {
			typeName: 'CruiseControl.rb',
			baseUrl: 'cruisecontrol.rb',
			urlHint: 'URL, e.g. http://cruisecontrolrb.thoughtworks.com/',
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
