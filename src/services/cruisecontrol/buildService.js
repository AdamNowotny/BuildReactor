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
				urlHint: 'http://cruisecontrol.instance.com/'
			};
		};

		return CCBuildService;
	});