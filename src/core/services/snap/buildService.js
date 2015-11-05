define([
	'core/services/cctray/buildService',
	'mout/object/mixIn'
], function (CCTrayBuildService, mixIn) {

	'use strict';

	var SnapService = function (settings) {
		mixIn(this, new CCTrayBuildService(settings, SnapService.settings()));
		this.cctrayLocation = '';
	};
	
	SnapService.settings = function () {
		return {
			typeName: 'Snap',
			baseUrl: 'snap',
			urlHint: 'copy CCTRAY link from Snap',
			icon: 'src/core/services/snap/icon.png',
			logo: 'src/core/services/snap/logo.png',
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