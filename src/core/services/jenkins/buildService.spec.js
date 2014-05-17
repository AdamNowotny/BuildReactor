define([
	'core/services/jenkins/buildService',
	'core/services/jenkins/jenkinsBuild',
	'core/services/request',
	'rx',
	'text!core/services/jenkins/availableBuilds.fixture.json',
	'text!core/services/jenkins/availableBuilds.primaryView.fixture.json'
], function (BuildService, JenkinsBuild, request, Rx, availableBuildsFixture, viewFixture) {

	'use strict';

	describe('core/services/jenkins/buildService', function () {

		var settings;
		var service;

		beforeEach(function () {
			settings = {
				typeName: 'Jenkins',
				baseUrl: 'jenkins',
				icon: 'jenkins/icon.png',
				url: 'http://ci.jenkins-ci.org/',
				name: 'Jenkins instance',
				projects: ['BuildReactor']
			};
			service = new BuildService(settings);
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('Jenkins');
			expect(defaultSettings.baseUrl).toBe('jenkins');
			expect(defaultSettings.icon).toBe('jenkins/icon.png');
			expect(defaultSettings.logo).toBe('jenkins/logo.png');
			expect(defaultSettings.url).toBeDefined();
			expect(defaultSettings.urlHint).toBe('URL, e.g. http://ci.jenkins-ci.org/');
			expect(defaultSettings.username).toBeDefined();
			expect(defaultSettings.password).toBeDefined();
			expect(defaultSettings.updateInterval).toBe(60);
		});

		it('should set Build factory method', function () {
			expect(service.Build).toBe(JenkinsBuild);
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

		describe('availableBuilds', function () {

			var availableBuildsJson, jobJson, viewJson;
			var service;
			var scheduler;

			beforeEach(function () {
				scheduler = new Rx.TestScheduler();
				availableBuildsJson = JSON.parse(availableBuildsFixture);
				viewJson = JSON.parse(viewFixture);
				spyOn(request, 'json').andCallFake(function (options) {
					if (options.url === 'http://ci.jenkins-ci.org/api/json?tree=jobs[name,buildable],primaryView[name],views[name,url]') {
						return Rx.Observable.returnValue(availableBuildsJson);
					} else if (options.url.indexOf('iew/') > -1) {
						return Rx.Observable.returnValue(viewJson);
					}
					throw 'Unknown url: ' + options.url;
				});
				service = new BuildService(settings);
			});

			it('should use credentials', function () {
				settings.username = 'USERNAME';
				settings.password = 'PASSWORD';
				request.json.andCallFake(function (options) {
					expect(options.username).toBe(settings.username);
					expect(options.password).toBe(settings.password);
					return Rx.Observable.never();
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should get available builds from correct URL', function () {
				request.json.andCallFake(function (options) {
					expect(options.url).toBe('http://ci.jenkins-ci.org/api/json?tree=jobs[name,buildable],primaryView[name],views[name,url]');
					return Rx.Observable.never();
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should increase timeout for view details', function () {
				request.json.andCallFake(function (options) {
					if (options.url === 'http://ci.jenkins-ci.org/api/json?tree=jobs[name,buildable],primaryView[name],views[name,url]') {
						return Rx.Observable.returnValue(availableBuildsJson);
					} else if (options.url.indexOf('iew/') > -1) {
						expect(options.timeout).toBe(90000);
						return Rx.Observable.returnValue(viewJson);
					}
					throw 'Unknown url: ' + options.url;
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});
			
			it('should return projects', function () {
				var result = scheduler.startWithCreate(function () {
					return service.availableBuilds();
				});
		
				expect(result.messages).toHaveElementsMatchingAt(200, function (builds) {
					expect(builds.items.length).toBe(77);
					expect(builds.items[0].id).toBe('config-provider-model');
					expect(builds.items[0].name).toBe('config-provider-model');
					expect(builds.items[0].group).toBe(null);
					expect(builds.items[0].isDisabled).toBe(false);
					return true;
				});
			});

			it('should return views', function () {
				var result = scheduler.startWithCreate(function () {
					return service.availableBuilds();
				});
		
				expect(result.messages).toHaveElementsMatchingAt(200, function (builds) {
					expect(builds.primaryView).toBe('All Failed');
					expect(builds.views.length).toBe(8);
					expect(builds.views[0].name).toBe('All');
					expect(builds.views[0].items.length).toBe(16);
					expect(builds.views[0].items[0]).toBe('core_selenium-test');
					return true;
				});
			});

		});
	});

});