define([
	'core/services/go/buildService'
], function (BuildService) {

	'use strict';

	describe('core/services/go/buildService', function () {

		var settings;

		beforeEach(function () {
			settings = {
				typeName: 'GoCD',
				baseUrl: 'go',
				icon: 'go/icon.png',
				url: 'http://example.com/',
				name: 'GO instance',
				projects : []
			};
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('GoCD');
			expect(defaultSettings.baseUrl).toBe('go');
			expect(defaultSettings.icon).toBe('go/icon.png');
			expect(defaultSettings.logo).toBe('go/logo.png');
			expect(defaultSettings.url).toBeDefined();
			expect(defaultSettings.urlHint).toBe('URL, e.g. http://example-go.thoughtworks.com/');
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