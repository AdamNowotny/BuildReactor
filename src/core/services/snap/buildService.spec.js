define([
	'core/services/snap/buildService'
], function (BuildService) {

	'use strict';

	describe('core/services/snap/buildService', function () {

		var settings;

		beforeEach(function () {
			settings = {
				typeName: 'Snap',
				baseUrl: 'snap',
				icon: 'snap/icon.png',
				url: 'http://example.com/cctray.xml',
				name: 'Snap instance',
				projects : []
			};
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('Snap');
			expect(defaultSettings.baseUrl).toBe('snap');
			expect(defaultSettings.icon).toBe('snap/icon.png');
			expect(defaultSettings.logo).toBe('snap/logo.png');
			expect(defaultSettings.url).toBeDefined();
			expect(defaultSettings.urlHint).toBe('copy CCTRAY link from Snap');
			expect(defaultSettings.updateInterval).toBe(60);
		});

		it('should define cctray xml location', function () {
			var service = new BuildService(settings);

			expect(service.cctrayLocation).toBe('');
		});

	});

});