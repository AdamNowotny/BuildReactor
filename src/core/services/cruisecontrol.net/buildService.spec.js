define([
	'core/services/cruisecontrol.net/buildService'
], function(BuildService) {

	'use strict';

	describe('core/services/cruisecontrol.net/buildService', function() {

		var settings;
		var service;

		beforeEach(function() {
			settings = {
				typeName: 'CruiseControl.NET',
				baseUrl: 'cruisecontrol.net',
				icon: 'cruisecontrol.net/icon.png',
				url: 'http://example.com/',
				name: 'CC.NET instance',
				projects : []
			};
			service = new BuildService(settings);
		});

		it('should expose interface', function() {
			expect(service.settings).toBe(settings);
			expect(service.updateAll).toBeDefined();
			expect(service.start).toBeDefined();
			expect(service.stop).toBeDefined();
			expect(service.activeProjects).toBeDefined();
			expect(service.availableBuilds).toBeDefined();
			expect(service.events).toBeDefined();
		});

		it('should define cctray xml location', function() {
			expect(service.cctrayLocation).toBe('XmlStatusReport.aspx');
		});

	});

});
