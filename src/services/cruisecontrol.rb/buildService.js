define(['services/cctray/buildService', 'jquery'], function (CCTrayBuildService, $) {

		'use strict';

		var CcrbBuildService = function (settings) {
			$.extend(this, new CCTrayBuildService(settings));
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
				urlHint: 'http://cruisecontrolrb.thoughtworks.com/',
				username: '',
				password: '',
				updateInterval: 60
			};
		};

		return CcrbBuildService;
	});