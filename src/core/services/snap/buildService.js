define([
	'core/services/cctray/buildService',
	'mout/object/mixIn'
], function (CCTrayBuildService, mixIn) {

	'use strict';

	var SnapService = function (settings) {
		mixIn(this, new CCTrayBuildService(settings));
		this.cctrayLocation = '';
	};
	
	SnapService.settings = function () {
		return {
			typeName: 'Snap',
			baseUrl: 'snap',
			icon: 'snap/icon.png',
			logo: 'snap/logo.png',
			urlHint: 'copy CCTRAY link from Snap',
			defaultConfig: {
				baseUrl: 'snap',
				name: '',
				projects: [],
				url: '',
				updateInterval: 60
			}
		};
	};

	return SnapService;
});