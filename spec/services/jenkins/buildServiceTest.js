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

		describe('projects', function () {

			var mockRequest;
			var apiJson;
			var completed;

			var initResponse = function (response) {
				mockRequest.andCallFake(function () {
					completed = new Signal();
					completed.memorize = true;
					completed.dispatch({ response: response });
					return completed;
				});
			};

			beforeEach(function () {
				apiJson = JSON.parse(readFixtures('jenkins/views.json'));
				mockRequest = spyOn(jenkinsRequest, 'projects');
			});

			it('should return projects', function () {
				var service = new BuildService(settings);
				initResponse(apiJson);

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

			it('should signal error if parsing the reponse fails', function () {
				var service = new BuildService(settings);
				initResponse({ unknown: 'response'});

				var response;
				service.projects([]).addOnce(function (result) {
					response = result;
				});

				expect(response.error).toBeDefined();
				expect(response.error.name).toBe('ParseError');
			});

			it('should return views', function () {
				var service = new BuildService(settings);
				initResponse(apiJson);

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