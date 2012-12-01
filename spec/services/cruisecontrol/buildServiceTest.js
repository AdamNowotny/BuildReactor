define([
	'services/cruisecontrol/buildService'
], function (BuildService) {

	'use strict';

	describe('services/cruisecontrol/buildService', function () {

		var settings;
		var ccBuildInfo;

		beforeEach(function () {
			settings = {
				typeName: 'CruiseControl',
				baseUrl: 'cruisecontrol',
				icon: 'cruisecontrol/icon.png',
				url: 'http://example.com/',
				name: 'CC instance'
			};
			ccBuildInfo = {
				serviceName: 'service name',
				buildName: 'build name',
				group: 'group name',
				url: 'http://example.com/link',
				icon: 'ci/icon.png'
			};
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('CruiseControl');
			expect(defaultSettings.baseUrl).toBe('cruisecontrol');
			expect(defaultSettings.icon).toBe('cruisecontrol/icon.png');
			expect(defaultSettings.logo).toBe('cruisecontrol/logo.png');
			expect(defaultSettings.urlHint).toBe('http://cruisecontrol.instance.com/');
		});

		it('should define cctray xml location', function () {
			var service = new BuildService(settings);

			expect(service.cctrayLocation).toBe('cctray.xml');
		});

	});

});