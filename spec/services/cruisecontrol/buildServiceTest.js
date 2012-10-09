require([
	'jasmineSignals',
	'services/cruisecontrol/buildService',
	'services/cctray/buildService'
], function (jasmineSignals, BuildService, CCTrayBuildService) {

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
		});

		it('should modify url used to get projects', function () {
			spyOn(CCTrayBuildService.prototype, 'projects').andCallFake(function (selectedPlans) {
				expect(this.settings.url).toBe('http://example.com/cctray.xml');
			});

			var service = new BuildService(settings);
			service.projects([ 'A', 'B' ]);

			expect(CCTrayBuildService.prototype.projects).toHaveBeenCalled();
		});

		it('should modify url', function () {
			spyOn(CCTrayBuildService.prototype, 'start').andCallFake(function () {
				expect(this.settings.url).toBe('http://example.com/cctray.xml');
			});

			var service = new BuildService(settings);
			service.start();

			expect(CCTrayBuildService.prototype.start).toHaveBeenCalled();
		});

	});

});