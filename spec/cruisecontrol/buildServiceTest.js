require([
	'jasmineSignals',
	'cruisecontrol/buildService',
	'cctray/buildService'
], function (jasmineSignals, BuildService, CCTrayBuildService) {

	'use strict';

	describe('cruisecontrol.rb/buildService', function () {

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

		it('should stop', function () {
			spyOn(CCTrayBuildService.prototype, 'stop');

			var service = new BuildService(settings);
			service.stop();

			expect(CCTrayBuildService.prototype.stop).toHaveBeenCalled();
		});

		it('should update', function () {
			spyOn(CCTrayBuildService.prototype, 'update');

			var service = new BuildService(settings);
			service.update();

			expect(CCTrayBuildService.prototype.update).toHaveBeenCalled();
		});

	});

});