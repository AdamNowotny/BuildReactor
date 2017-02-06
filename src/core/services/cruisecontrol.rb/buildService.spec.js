define([
	'core/services/cruisecontrol.rb/buildService'
], function(BuildService) {

	'use strict';

	describe('core/services/cruisecontrol.rb/buildService', function() {

		var settings;
		var service;

		beforeEach(function() {
			settings = {
				typeName: 'CruiseControl.rb',
				baseUrl: 'cruisecontrol.rb',
				icon: 'cruisecontrol.rb/icon.png',
				url: 'http://example.com/',
				name: 'CC.rb instance',
				projects : []
			};
			service = new BuildService(settings);
		});

		it('should expose interface', function() {
			expect(service.settings).toBe(settings);
			expect(service.updateAll).toBeDefined();
			expect(service.start).toBeDefined();
			expect(service.stop).toBeDefined();
			expect(service.availableBuilds).toBeDefined();
			expect(service.events).toBeDefined();
		});

		it('should define cctray xml location', function() {
			expect(service.cctrayLocation).toBe('XmlStatusReport.aspx');
		});

	});

});
