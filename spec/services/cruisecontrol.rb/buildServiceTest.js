define([
	'services/cruisecontrol.rb/buildService'
], function (BuildService) {

	'use strict';

	describe('services/cruisecontrol.rb/buildService', function () {

		var settings;

		beforeEach(function () {
			settings = {
				typeName: 'CruiseControl.rb',
				baseUrl: 'cruisecontrol.rb',
				icon: 'cruisecontrol.rb/icon.png',
				url: 'http://example.com/',
				name: 'CC.rb instance',
				projects : []
			};
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('CruiseControl.rb');
			expect(defaultSettings.baseUrl).toBe('cruisecontrol.rb');
			expect(defaultSettings.icon).toBe('cruisecontrol.rb/icon.png');
			expect(defaultSettings.logo).toBe('cruisecontrol.rb/logo.png');
			expect(defaultSettings.url).toBeDefined();
			expect(defaultSettings.urlHint).toBe('URL, e.g. http://cruisecontrolrb.thoughtworks.com/');
			expect(defaultSettings.username).toBeDefined();
			expect(defaultSettings.password).toBeDefined();
			expect(defaultSettings.updateInterval).toBe(60);
		});

		it('should define cctray xml location', function () {
			var service = new BuildService(settings);

			expect(service.cctrayLocation).toBe('XmlStatusReport.aspx');
		});

	});

});