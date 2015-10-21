define([
	'core/services/cctray/buildService',
	'mout/object/mixIn'
], function (CCTrayBuildService, mixIn) {

	'use strict';

	var CcrbBuildService = function (settings) {
		mixIn(this, new CCTrayBuildService(settings));
		this.cctrayLocation = 'XmlStatusReport.aspx';
	};
	
	CcrbBuildService.settings = function () {
		return {
			typeName: 'CruiseControl.rb',
			baseUrl: 'cruisecontrol.rb',
			icon: 'cruisecontrol.rb/icon.png',
			logo: 'cruisecontrol.rb/logo.png',
			projects: [],
			url: '',
			urlHint: 'URL, e.g. http://cruisecontrolrb.thoughtworks.com/',
			username: '',
			password: '',
			updateInterval: 60,
			initialUrl: 'XmlStatusReport.aspx'
		};
	};

	return CcrbBuildService;
});