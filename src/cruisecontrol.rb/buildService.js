define([
		'jquery',
		'signals',
		'cctray/buildService',
		'timer',
		'amdUtils/string/interpolate',
		'amdUtils/array/contains'
	], function ($, signals, CCTrayBuildService, Timer, interpolate, contains) {

		'use strict';

		var CcrbBuildService = function (settings) {
			var cctraySettings = createCCTraySettings(settings);
			CCTrayBuildService.apply(this, [cctraySettings]);
		};
		
		CcrbBuildService.prototype = CCTrayBuildService.prototype;

		function createCCTraySettings(settings) {
			var cctraySettings = CcrbBuildService.settings();
			cctraySettings.name = settings.name;
			cctraySettings.url = settings.url + 'XmlStatusReport.aspx';
			cctraySettings.updateInterval = settings.updateInterval;
			cctraySettings.projects = settings.projects;
			cctraySettings.icon = settings.icon;
			return cctraySettings;
		}

		CcrbBuildService.settings = function () {
			return {
				typeName: 'CruiseControl.rb',
				baseUrl: 'cruisecontrol.rb',
				icon: 'cruisecontrol.rb/icon.png',
				logo: 'cruisecontrol.rb/logo.png',
				projects: []
			};
		};

		return CcrbBuildService;
	});