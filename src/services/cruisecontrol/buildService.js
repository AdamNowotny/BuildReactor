define(['services/cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var CCBuildService = function (settings) {
			this.cctrayLocation = function () {
				return 'cctray.xml';
			};
			CCTrayBuildService.apply(this, [settings]);
		};
		
		CCBuildService.prototype = CCTrayBuildService.prototype;

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