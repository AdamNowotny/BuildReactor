define([
	'services/jenkins/buildService'
], function (BuildService) {

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

		it('should define cctray xml location', function () {
			var service = new BuildService(settings);

			expect(service.cctrayLocation).toBe('cc.xml');
		});

	});

});