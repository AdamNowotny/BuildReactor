define(['services/cctray/buildService'], function (CCTrayBuildService) {

		'use strict';

		var CcrbBuildService = function (settings) {
			this.cctrayLocation = function () {
				return 'XmlStatusReport.aspx';
			};
			CCTrayBuildService.apply(this, [settings]);
		};
		
		CcrbBuildService.prototype = CCTrayBuildService.prototype;

		CcrbBuildService.settings = function () {
			return {
				typeName: 'CruiseControl.rb',
				baseUrl: 'cruisecontrol.rb',
				icon: 'cruisecontrol.rb/icon.png',
				logo: 'cruisecontrol.rb/logo.png',
				projects: [],
				urlHint: 'http://cruisecontrolrb.thoughtworks.com/'
			};
		};

		return CcrbBuildService;
	});