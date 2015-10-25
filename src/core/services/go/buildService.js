define([
	'core/services/cctray/buildService',
	'mout/object/mixIn'
], function (CCTrayBuildService, mixIn) {

	'use strict';

	var GoBuildService = function (settings) {
		mixIn(this, new CCTrayBuildService(settings));
		this.cctrayLocation = 'cctray.xml';
	};
	
	GoBuildService.settings = function () {
		return {
			typeName: 'GoCD',
			baseUrl: 'go',
			urlHint: 'URL, e.g. http://example-go.thoughtworks.com/',
			defaultConfig: {
				baseUrl: 'go',
				name: '',
				projects: [],
				url: '',
				username: '',
				password: '',
				updateInterval: 60
			}
		};
	};

	return GoBuildService;
});