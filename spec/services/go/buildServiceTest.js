define([
	'services/go/buildService',
	'services/cctray/buildService'
], function (BuildService, CCTrayBuildService) {

	'use strict';

	describe('services/cruisecontrol.rb/buildService', function () {

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
			expect(defaultSettings.urlHint).toBe('http://example-go.thoughtworks.com/');
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