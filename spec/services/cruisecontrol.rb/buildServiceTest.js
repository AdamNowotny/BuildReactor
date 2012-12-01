define([
	'services/cruisecontrol.rb/buildService'
], function (BuildService) {

	'use strict';

	describe('services/cruisecontrol.rb/buildService', function () {

		var settings;
		var ccBuildInfo;

		beforeEach(function () {
			settings = {
				typeName: 'CruiseControl.rb',
				baseUrl: 'cruisecontrol.rb',
				icon: 'cruisecontrol.rb/icon.png',
				url: 'http://example.com/',
				name: 'CC.rb instance'
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

			expect(defaultSettings.typeName).toBe('CruiseControl.rb');
			expect(defaultSettings.baseUrl).toBe('cruisecontrol.rb');
			expect(defaultSettings.icon).toBe('cruisecontrol.rb/icon.png');
			expect(defaultSettings.logo).toBe('cruisecontrol.rb/logo.png');
			expect(defaultSettings.urlHint).toBe('http://cruisecontrolrb.thoughtworks.com/');
		});

		it('should define cctray xml location', function () {
			var service = new BuildService(settings);

			expect(service.cctrayLocation).toBe('XmlStatusReport.aspx');
		});

	});

});