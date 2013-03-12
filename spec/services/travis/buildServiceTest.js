define([
	'services/travis/buildService',
	'services/request',
	'rx'
], function (BuildService, request, Rx) {

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

		it('should return available projects', function () {
			var repos = JSON.parse(readFixtures('travis/repositories.json'));
			spyOn(request, 'json').andReturn(Rx.Observable.returnValue({ data: repos }));
			var response;

			service.projects([]).addOnce(function (result) {
				response = result;
			});

			expect(response.error).not.toBeDefined();
			expect(response.projects).toBeDefined();
		});

		it('should return available builds', function () {
			var repos = JSON.parse(readFixtures('travis/repositories.json'));
			spyOn(request, 'json').andReturn(Rx.Observable.returnValue({ data: repos }));

			service.availableBuilds().subscribe(function (d) {
				expect(d.items.length).toBe(2);
				expect(d.items[1].id).toBe('AdamNowotny/BuildReactor');
				expect(d.items[1].name).toBe('AdamNowotny/BuildReactor');
				expect(d.items[1].group).toBe(null);
				expect(d.items[1].enabled).toBe(true);
			});
		});

	});

});