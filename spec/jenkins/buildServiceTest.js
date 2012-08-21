require([
	'jasmineSignals',
	'jenkins/buildService',
	'cctray/buildService'
], function (jasmineSignals, BuildService, CCTrayBuildService) {

	'use strict';

	describe('jenkins/buildService', function () {

		var settings;
		var ccBuildInfo;

		beforeEach(function () {
			settings = {
				typeName: 'Jenkins',
				baseUrl: 'jenkins',
				icon: 'jenkins/icon.png',
				url: 'http://example.com/',
				name: 'Jenkins instance'
			};
			ccBuildInfo = {
				serviceName: 'cc service name',
				buildName: 'cc build name',
				group: 'cc group name',
				url: 'http://example.com/cc_link',
				icon: 'cctray/icon.png'
			};
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('Jenkins');
			expect(defaultSettings.baseUrl).toBe('jenkins');
			expect(defaultSettings.icon).toBe('jenkins/icon.png');
		});

		it('should modify url used to get projects', function () {
			spyOn(CCTrayBuildService.prototype, 'projects').andCallFake(function (selectedPlans) {
				expect(this.settings.url).toBe('http://example.com/cc.xml');
			});

			var service = new BuildService(settings);
			service.projects([ 'A', 'B' ]);

			expect(CCTrayBuildService.prototype.projects).toHaveBeenCalled();
		});

		it('should modify url', function () {
			spyOn(CCTrayBuildService.prototype, 'start').andCallFake(function () {
				expect(this.settings.url).toBe('http://example.com/cc.xml');
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