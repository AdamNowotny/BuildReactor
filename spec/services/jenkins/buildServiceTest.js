define([
	'services/jenkins/buildService',
	'services/jenkins/jenkinsRequest',
	'signals'
], function (BuildService, jenkinsRequest, Signal) {

	'use strict';

	describe('services/jenkins/buildService', function () {

		var settings;

		beforeEach(function () {
			settings = {
				typeName: 'Jenkins',
				baseUrl: 'jenkins',
				icon: 'jenkins/icon.png',
				url: 'http://example.com/',
				name: 'Jenkins instance'
			};
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('Jenkins');
			expect(defaultSettings.baseUrl).toBe('jenkins');
			expect(defaultSettings.icon).toBe('jenkins/icon.png');
			expect(defaultSettings.logo).toBe('jenkins/logo.png');
			expect(defaultSettings.urlHint).toBe('http://ci.jenkins-ci.org/');
		});

		it('should set cctrayLocation when All is primary view', function () {
			settings.primaryView = 'All';
			var service = new BuildService(settings);

			expect(service.cctrayLocation).toBe('cc.xml');
		});

		it('should set cctrayLocation when All is not the primary view', function () {
			settings.primaryView = 'All Failed';
			var service = new BuildService(settings);

			expect(service.cctrayLocation).toBe('view/All/cc.xml');
		});

		it('should set cctrayLocation if primaryView not set', function () {
			settings.primaryView = undefined;
			var service = new BuildService(settings);

			expect(service.cctrayLocation).toBe('cc.xml');
		});

		describe('projects', function () {

			var mockRequest;
			var apiJson;
			var responseReceived;
			var errorReceived;

			var initResponse = function () {
				mockRequest.andCallFake(function () {
					responseReceived.dispatch(apiJson);
					return {
						responseReceived: responseReceived,
						errorReceived: errorReceived
					};
				});
			};

			beforeEach(function () {
				responseReceived = new Signal();
				responseReceived.memorize = true;
				errorReceived = new Signal();
				errorReceived.memorize = true;
				apiJson = JSON.parse(readFixtures('jenkins/views.json'));
				mockRequest = spyOn(jenkinsRequest, 'projects');
			});

			it('should return projects', function () {
				var service = new BuildService(settings);
				initResponse();

				var response;
				service.projects([]).addOnce(function (result) {
					response = result;
				});

				expect(response.projects.items).toBeDefined();
				expect(response.projects.items.length).toBe(63);
				expect(response.projects.items[0].id).toBeDefined();
				expect(response.projects.items[0].name).toBeDefined();
				expect(response.projects.items[0].group).toBeDefined();
				expect(response.projects.items[0].enabled).toBeDefined();
				expect(response.projects.items[0].selected).toBeDefined();
			});

			it('should return views', function () {
				var service = new BuildService(settings);
				initResponse();

				var response;
				service.projects([]).addOnce(function (result) {
					response = result;
				});

				expect(response.projects.views).toBeDefined();
				expect(response.projects.views[0].name).toBeDefined();
				expect(response.projects.views[0].items).toBeDefined();
				expect(response.projects.views[0].items[0]).toBeDefined();
				expect(response.projects.primaryView).toBeDefined();
			});

		});
	});

});