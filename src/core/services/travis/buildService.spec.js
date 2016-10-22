define([
	'core/services/travis/buildService',
	'core/services/travis/travisBuild',
	'core/services/request',
	'rx',
	'raw!core/services/travis/repositories.fixture.json'
], function(BuildService, TravisBuild, request, Rx, reposFixture) {

	'use strict';

	describe('core/services/travis/BuildService', function() {

		var service;
		var settings;

		beforeEach(function() {
			settings = {
				name: 'My Travis CI',
				username: 'AdamNowotny',
				updateInterval: 1,
				projects: ['BuildReactor']
			};
			service = new BuildService(settings);
		});

		it('should set Build factory method', function() {
			expect(service.Build).toBe(TravisBuild);
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

		describe('availableBuilds', function() {

			it('should return available builds', function() {
				var rxJson = Rx.Observable.never();
				spyOn(request, 'json').and.returnValue(rxJson);

				var response = service.availableBuilds();

				expect(response).toBe(rxJson);
			});

			it('should pass options to request', function() {
				spyOn(request, 'json').and.callFake(function(options) {
					expect(options.data['owner_name']).toBe(settings.username);
					expect(options.url).toBe('https://api.travis-ci.org/repos/');
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should parse response', function() {
				var reposJson = JSON.parse(reposFixture);
				spyOn(request, 'json').and.callFake(function(options) {
					var response = options.parser(reposJson);
					expect(response.items.length).toBe(2);
					expect(response.items[1].id).toBe('AdamNowotny/BuildReactor');
					expect(response.items[1].name).toBe('BuildReactor');
					expect(response.items[1].group).toBe('AdamNowotny');
					expect(response.items[1].isDisabled).toBe(false);
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

		});

	});

});
