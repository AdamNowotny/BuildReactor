define([
	'services/cruisecontrol/buildService',
	'services/cctray/buildService'
], function (BuildService, CCTrayBuildService) {

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

		it('should modify url used to get projects', function () {
			var service = new BuildService(settings);
			spyOn(service, 'projects').andCallFake(function (selectedPlans) {
				expect(this.settings.url).toBe('http://example.com/cctray.xml');
			});

			service.projects([ 'A', 'B' ]);

			expect(service.projects).toHaveBeenCalled();
		});

		it('should modify url', function () {
			var service = new BuildService(settings);
			spyOn(service, 'start').andCallFake(function () {
				expect(this.settings.url).toBe('http://example.com/cctray.xml');
			});

			service.start();

			expect(service.start).toHaveBeenCalled();
		});

	});

});