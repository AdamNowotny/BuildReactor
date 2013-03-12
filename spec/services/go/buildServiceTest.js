define([
	'services/go/buildService'
], function (BuildService) {

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
			expect(defaultSettings.url).toBeDefined();
			expect(defaultSettings.urlHint).toBe('http://example-go.thoughtworks.com/');
			expect(defaultSettings.username).toBeDefined();
			expect(defaultSettings.password).toBeDefined();
			expect(defaultSettings.updateInterval).toBe(60);
		});

		it('should define cctray xml location', function () {
			var service = new BuildService(settings);

			expect(service.cctrayLocation).toBe('cctray.xml');
		});

	});

});