require([
	'services/jenkins/buildService',
	'services/cctray/buildService'
], function (BuildService, CCTrayBuildService) {

	'use strict';

	describe('services/jenkins/buildService', function () {

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
			expect(defaultSettings.logo).toBe('jenkins/logo.png');
			expect(defaultSettings.urlHint).toBe('http://ci.jenkins-ci.org/');
		});

		it('should modify url used to get projects', function () {
			var service = new BuildService(settings);
			spyOn(service, 'projects').andCallFake(function (selectedPlans) {
				expect(this.settings.url).toBe('http://example.com/cc.xml');
			});

			service.projects([ 'A', 'B' ]);

			expect(service.projects).toHaveBeenCalled();
		});

		it('should modify url', function () {
			var service = new BuildService(settings);
			spyOn(service, 'start').andCallFake(function () {
				expect(this.settings.url).toBe('http://example.com/cc.xml');
			});

			service.start();

			expect(service.start).toHaveBeenCalled();
		});

	});

});