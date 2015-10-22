define([
	'core/services/cruisecontrol/buildService'
], function (BuildService) {

	'use strict';

	describe('core/services/cruisecontrol/buildService', function () {

		var settings;
		var service;

		beforeEach(function () {
			settings = {
				typeName: 'CruiseControl',
				baseUrl: 'cruisecontrol',
				icon: 'cruisecontrol/icon.png',
				url: 'http://example.com/',
				name: 'CC instance',
				projects : []
			};
			service = new BuildService(settings);
		});

		it('should expose interface', function () {
			expect(service.settings).toBe(settings);
			expect(service.updateAll).toBeDefined();
			expect(service.start).toBeDefined();
			expect(service.stop).toBeDefined();
			expect(service.activeProjects).toBeDefined();
			expect(service.availableBuilds).toBeDefined();
			expect(service.events).toBeDefined();
		});

		it('should define cctray xml location', function () {
			expect(service.cctrayLocation).toBe('cctray.xml');
		});

	});

});