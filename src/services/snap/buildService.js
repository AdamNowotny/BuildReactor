define(['services/cctray/buildService', 'mout/object/mixIn'], function (CCTrayBuildService, mixIn) {

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
			projects: [],
			url: '',
			urlHint: 'copy CCTRAY link from Snap',
			updateInterval: 60
		};
	};

	return SnapService;
});