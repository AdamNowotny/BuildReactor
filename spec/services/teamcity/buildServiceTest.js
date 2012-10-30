require([
	'jasmineSignals',
	'services/teamcity/buildService',
	'services/cctray/buildService'
], function (jasmineSignals, BuildService, CCTrayBuildService) {

	'use strict';

	describe('services/teamcity/buildService', function () {

		var settings;
		var ccBuildInfo;

		beforeEach(function () {
			settings = {
				typeName: 'TeamCity 7',
				baseUrl: 'teamcity',
				icon: 'teamcity/icon.png',
				url: 'http://example.com/',
				name: 'TeamCity instance'
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

			expect(defaultSettings.typeName).toBe('TeamCity 7+');
			expect(defaultSettings.baseUrl).toBe('teamcity');
			expect(defaultSettings.icon).toBe('teamcity/icon.png');
			expect(defaultSettings.logo).toBe('teamcity/logo.png');
			expect(defaultSettings.urlHint).toBe('http://teamcity.jetbrains.com/');
		});

		it('should modify url used to get projects', function () {
			var service = new BuildService(settings);
			spyOn(service, 'projects').andCallFake(function (selectedPlans) {
				expect(this.settings.url).toBe('http://example.com/guestAuth/app/rest/cctray/projects.xml');
			});

			service.projects([ 'A', 'B' ]);

			expect(service.projects).toHaveBeenCalled();
		});

		it('should modify url', function () {
			var service = new BuildService(settings);
			spyOn(service, 'start').andCallFake(function () {
				expect(this.settings.url).toBe('http://example.com/guestAuth/app/rest/cctray/projects.xml');
			});

			service.start();

			expect(service.start).toHaveBeenCalled();
		});

	});

});