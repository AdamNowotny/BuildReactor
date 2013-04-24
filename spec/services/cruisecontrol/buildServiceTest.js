define([
	'services/cruisecontrol/buildService'
], function (BuildService) {

	'use strict';

	describe('services/cruisecontrol/buildService', function () {

		var settings;

		beforeEach(function () {
			settings = {
				typeName: 'CruiseControl',
				baseUrl: 'cruisecontrol',
				icon: 'cruisecontrol/icon.png',
				url: 'http://example.com/',
				name: 'CC instance',
				projects : []
			};
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('CruiseControl');
			expect(defaultSettings.baseUrl).toBe('cruisecontrol');
			expect(defaultSettings.icon).toBe('cruisecontrol/icon.png');
			expect(defaultSettings.logo).toBe('cruisecontrol/logo.png');
			expect(defaultSettings.url).toBeDefined();
			expect(defaultSettings.urlHint).toBe('http://cruisecontrol.instance.com/');
			expect(defaultSettings.username).toBeDefined();
			expect(defaultSettings.password).toBeDefined();
			expect(defaultSettings.updateInterval).toBe(60);
		});

		it('should define cctray xml location', function () {
			var service = new BuildService(settings);

			expect(service.cctrayLocation).toBe('cctray.xml');
		});

	});

});