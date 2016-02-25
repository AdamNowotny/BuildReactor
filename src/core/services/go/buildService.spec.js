define([
	'core/services/go/buildService'
], function(BuildService) {

	'use strict';

	describe('core/services/go/buildService', function() {

		var settings;
		var service;

		beforeEach(function() {
			settings = {
				typeName: 'GoCD',
				baseUrl: 'go',
				icon: 'go/icon.png',
				url: 'http://example.com/',
				name: 'GO instance',
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
			expect(service.cctrayLocation).toBe('cctray.xml');
		});

	});

});
