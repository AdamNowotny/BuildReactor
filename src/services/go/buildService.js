define(['services/cctray/buildService', 'mout/object/mixIn'], function (CCTrayBuildService, mixIn) {

	'use strict';

	var GoBuildService = function (settings) {
		mixIn(this, new CCTrayBuildService(settings));
		this.cctrayLocation = 'cctray.xml';
	};
	
	GoBuildService.settings = function () {
		return {
			typeName: 'ThoughtWorks GO',
			baseUrl: 'go',
			icon: 'go/icon.png',
			logo: 'go/logo.png',
			projects: [],
			url: '',
			urlHint: 'http://example-go.thoughtworks.com/',
			username: '',
			password: '',
			updateInterval: 60
		};
	};

	return GoBuildService;
});