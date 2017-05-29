define([
	'core/services/cctray/buildService'
], function(CCTrayBuildService) {

	'use strict';

	var SnapService = function(settings) {
		Object.assign(this, new CCTrayBuildService(settings, SnapService.settings()));
		this.cctrayLocation = '';
	};

	SnapService.settings = function() {
		return {
			typeName: 'Snap',
			baseUrl: 'snap',
			icon: 'core/services/snap/icon.png',
			logo: 'core/services/snap/logo.png',
			fields: [
                { type: 'url', help: 'Copy CCTRAY link from Snap' },
				{ type: 'username' },
                { type: 'password' }
            ],
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
