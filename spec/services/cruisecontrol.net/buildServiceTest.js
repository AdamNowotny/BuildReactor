define([
	'services/cruisecontrol.net/buildService'
], function (BuildService) {

	'use strict';

	describe('services/cruisecontrol.net/buildService', function () {

		var settings;

		beforeEach(function () {
			settings = {
				typeName: 'CruiseControl.NET',
				baseUrl: 'cruisecontrol.net',
				icon: 'cruisecontrol.net/icon.png',
				url: 'http://example.com/',
				name: 'CC.NET instance'
			};
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('CruiseControl.NET');
			expect(defaultSettings.baseUrl).toBe('cruisecontrol.net');
			expect(defaultSettings.icon).toBe('cruisecontrol.net/icon.png');
			expect(defaultSettings.logo).toBe('cruisecontrol.net/logo.png');
			expect(defaultSettings.url).toBeDefined();
			expect(defaultSettings.urlHint).toBe('http://build.nauck-it.de/');
			expect(defaultSettings.username).toBeDefined();
			expect(defaultSettings.password).toBeDefined();
			expect(defaultSettings.updateInterval).toBe(60);

		});

		it('should define cctray xml location', function () {
			var service = new BuildService(settings);

			expect(service.cctrayLocation).toBe('XmlStatusReport.aspx');
		});

	});

});