define(['services/cctray/buildService', 'jquery'], function (CCTrayBuildService, $) {

		'use strict';

		var GoBuildService = function (settings) {
			$.extend(this, new CCTrayBuildService(settings));
			this.cctrayLocation = 'cctray.xml';
		};
		
		GoBuildService.settings = function () {
			return {
				typeName: 'ThoughtWorks GO',
				baseUrl: 'go',
				icon: 'go/icon.png',
				logo: 'go/logo.png',
				projects: [],
				urlHint: 'http://example-go.thoughtworks.com/'
			};
		};

		return GoBuildService;
	});