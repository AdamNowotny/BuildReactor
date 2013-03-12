define(['services/cctray/buildService', 'jquery'], function (CCTrayBuildService, $) {

		'use strict';

		var CCBuildService = function (settings) {
			$.extend(this, new CCTrayBuildService(settings));
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