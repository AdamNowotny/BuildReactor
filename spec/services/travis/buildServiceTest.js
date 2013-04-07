define([
	'services/travis/buildService',
	'services/request',
	'rx',
	'json!fixtures/travis/repositories.json'
], function (BuildService, request, Rx, reposJson) {

	'use strict';

	describe('services/travis/BuildService', function () {

		var service;
		var settings;

		beforeEach(function () {
			settings = {
				name: 'My Travis CI',
				username: 'AdamNowotny',
				updateInterval: 10000,
				projects: ['BuildReactor']
			};
			service = new BuildService(settings);
		});

		it('should get settings', function () {
			var settings = BuildService.settings();

			expect(settings.typeName).toBe('Travis');
			expect(settings.baseUrl).toBe('travis');
			expect(settings.icon).toBe('travis/icon.png');
			expect(settings.logo).toBe('travis/logo.png');
			expect(settings.projects.length).toBe(0);
			expect(settings.username).toBe('');
		});

		describe('availableBuilds', function () {

			it('should return available builds', function () {
				var builds = Rx.Observable.returnValue(reposJson);
				spyOn(request, 'json').andReturn(builds);

				expect(service.availableBuilds()).toBe(builds);
			});

			it('should parse response', function () {
				spyOn(request, 'json').andCallFake(function (options) {
					var response = options.parseHandler(reposJson);
					expect(response.items.length).toBe(2);
					expect(response.items[1].id).toBe('AdamNowotny/BuildReactor');
					expect(response.items[1].name).toBe('AdamNowotny/BuildReactor');
					expect(response.items[1].group).toBe(null);
					expect(response.items[1].enabled).toBe(true);
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

		});

	});

});