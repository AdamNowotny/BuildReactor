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

		it('should signal brokenBuild when CC signals', function () {
			var service = new BuildService(settings);
			var spyBrokenBuild = jasmineSignals.spyOnSignal(service.on.brokenBuild).andCallFake(function (buildInfo) {
				expect(buildInfo.serviceName).toBe(settings.name);
				expect(buildInfo.buildName).toBe(ccBuildInfo.buildName);
				expect(buildInfo.group).toBe(ccBuildInfo.group);
				expect(buildInfo.url).toBe(ccBuildInfo.url);
				expect(buildInfo.icon).toBe(settings.icon);
			});

			service._cctrayService.on.brokenBuild.dispatch(ccBuildInfo);

			expect(spyBrokenBuild).toHaveBeenDispatched(1);
		});

		it('should signal fixedBuild when CC signals', function () {
			var service = new BuildService(settings);
			var spyFixedBuild = jasmineSignals.spyOnSignal(service.on.fixedBuild).andCallFake(function (buildInfo) {
				expect(buildInfo.serviceName).toBe(settings.name);
				expect(buildInfo.buildName).toBe(ccBuildInfo.buildName);
				expect(buildInfo.group).toBe(ccBuildInfo.group);
				expect(buildInfo.url).toBe(ccBuildInfo.url);
				expect(buildInfo.icon).toBe(settings.icon);
			});

			service._cctrayService.on.fixedBuild.dispatch(ccBuildInfo);

			expect(spyFixedBuild).toHaveBeenDispatched(1);
		});

		it('should signal updating when CC signals', function () {
			var service = new BuildService(settings);
			var spyUpdating = jasmineSignals.spyOnSignal(service.on.updating);

			service._cctrayService.on.updating.dispatch(ccBuildInfo);

			expect(spyUpdating).toHaveBeenDispatched(1);
		});

		it('should signal updated when CC signals', function () {
			var service = new BuildService(settings);
			var spyUpdated = jasmineSignals.spyOnSignal(service.on.updated);

			service._cctrayService.on.updated.dispatch(ccBuildInfo);

			expect(spyUpdated).toHaveBeenDispatched(1);
		});

		it('should signal errorThrown when CC signals', function () {
			var service = new BuildService(settings);
			var spyErrorThrown = jasmineSignals.spyOnSignal(service.on.errorThrown);

			service._cctrayService.on.errorThrown.dispatch(ccBuildInfo);

			expect(spyErrorThrown).toHaveBeenDispatched(1);
		});
	});

});