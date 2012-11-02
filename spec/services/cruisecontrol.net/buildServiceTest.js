require([
	'services/cruisecontrol.net/buildService',
	'services/cctray/buildService'
], function (BuildService, CCTrayBuildService) {

	'use strict';

	describe('services/cruisecontrol.net/buildService', function () {

		var settings;
		var ccBuildInfo;

		beforeEach(function () {
			settings = {
				typeName: 'CruiseControl.NET',
				baseUrl: 'cruisecontrol.net',
				icon: 'cruisecontrol.net/icon.png',
				url: 'http://example.com/',
				name: 'CC.NET instance'
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

			expect(defaultSettings.typeName).toBe('CruiseControl.NET');
			expect(defaultSettings.baseUrl).toBe('cruisecontrol.net');
			expect(defaultSettings.icon).toBe('cruisecontrol.net/icon.png');
			expect(defaultSettings.logo).toBe('cruisecontrol.net/logo.png');
			expect(defaultSettings.urlHint).toBe('http://build.nauck-it.de/');
		});

		it('should modify url used to get projects', function () {
			var service = new BuildService(settings);
			spyOn(service, 'projects').andCallFake(function (selectedPlans) {
				expect(this.settings.url).toBe('http://example.com/XmlStatusReport.aspx');
			});

			service.projects([ 'A', 'B' ]);

			expect(service.projects).toHaveBeenCalled();
		});

		it('should modify url', function () {
			var service = new BuildService(settings);
			spyOn(service, 'start').andCallFake(function () {
				expect(this.settings.url).toBe('http://example.com/XmlStatusReport.aspx');
			});

			service.start();

			expect(service.start).toHaveBeenCalled();
		});

	});

});