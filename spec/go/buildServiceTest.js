require([
	'jasmineSignals',
	'go/buildService',
	'cctray/buildService'
], function (jasmineSignals, BuildService, CCTrayBuildService) {

	'use strict';

	describe('cruisecontrol.rb/buildService', function () {

		var settings;
		var ccBuildInfo;

		beforeEach(function () {
			settings = {
				typeName: 'ThoughtWorks GO',
				baseUrl: 'go',
				icon: 'go/icon.png',
				url: 'http://example.com/',
				name: 'GO instance'
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

			expect(defaultSettings.typeName).toBe('ThoughtWorks GO');
			expect(defaultSettings.baseUrl).toBe('go');
			expect(defaultSettings.icon).toBe('go/icon.png');
			expect(defaultSettings.logo).toBe('go/logo.png');
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