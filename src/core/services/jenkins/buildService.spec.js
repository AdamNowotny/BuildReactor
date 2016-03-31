define([
	'core/services/jenkins/buildService',
	'core/services/jenkins/jenkinsBuild',
	'core/services/request',
	'rx',
	'raw!core/services/jenkins/availableBuilds.fixture.json',
	'raw!core/services/jenkins/availableBuilds.primaryView.fixture.json',
	'raw!core/services/jenkins/availableBuilds.incorrectUrl.fixture.json'
], function(BuildService, JenkinsBuild, request, Rx, availableBuildsFixture, viewFixture, availableBuildsIncorrectFixture) {

	'use strict';

	describe('core/services/jenkins/buildService', function() {

		var settings;
		var service;

		beforeEach(function() {
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

		it('should set Build factory method', function() {
			expect(service.Build).toBe(JenkinsBuild);
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

			var availableBuildsJson, jobJson, viewJson;
			var service;
			var scheduler;

			function setupRequestSpy(availableBuildsJson, viewJson) {
				request.json.and.callFake(function(options) {
					if (options.url === 'http://ci.jenkins-ci.org/api/json?tree=jobs[name,buildable],primaryView[name],views[name,url]') {
						return Rx.Observable.returnValue(availableBuildsJson);
					} else if (options.url.indexOf('/view/') > -1) {
						return Rx.Observable.returnValue(viewJson);
					}
					throw 'Unknown url: ' + options.url;
				});
			}

			beforeEach(function() {
				scheduler = new Rx.TestScheduler();
				availableBuildsJson = JSON.parse(availableBuildsFixture);
				viewJson = JSON.parse(viewFixture);
				spyOn(request, 'json');
				service = new BuildService(settings);
				setupRequestSpy(availableBuildsJson, viewJson);
			});

			it('should use credentials', function() {
				settings.username = 'USERNAME';
				settings.password = 'PASSWORD';
				request.json.and.callFake(function(options) {
					expect(options.username).toBe(settings.username);
					expect(options.password).toBe(settings.password);
					return Rx.Observable.never();
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should get available builds from correct URL', function() {
				request.json.and.callFake(function(options) {
					expect(options.url).toBe('http://ci.jenkins-ci.org/api/json?tree=jobs[name,buildable],primaryView[name],views[name,url]');
					return Rx.Observable.never();
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should increase timeout for view details', function() {
				request.json.and.callFake(function(options) {
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
			
			it('should return projects', function() {
				var result = scheduler.startWithCreate(function() {
					return service.availableBuilds();
				});
		
				expect(result.messages).toHaveElementsMatchingAt(200, function(builds) {
					expect(builds.items.length).toBe(77);
					expect(builds.items[0].id).toBe('config-provider-model');
					expect(builds.items[0].name).toBe('config-provider-model');
					expect(builds.items[0].group).toBe(null);
					expect(builds.items[0].isDisabled).toBe(false);
					return true;
				});
			});

			it('should return views', function() {
				var result = scheduler.startWithCreate(function() {
					return service.availableBuilds();
				});
		
				expect(result.messages).toHaveElementsMatchingAt(200, function(builds) {
					expect(builds.primaryView).toBe('All Failed');
					expect(builds.views.length).toBe(8);
					expect(builds.views[0].name).toBe('All');
					expect(builds.views[0].items.length).toBe(16);
					expect(builds.views[0].items[0]).toBe('core_selenium-test');
					return true;
				});
			});

			it('should fix url to primaryView', function() {
				var availableBuildsJson = JSON.parse(availableBuildsIncorrectFixture);
				setupRequestSpy(availableBuildsJson, viewJson);

				var result = scheduler.startWithCreate(function() {
					return service.availableBuilds();
				});
		
				expect(result.messages).toHaveElementsMatchingAt(200, function(builds) {
					expect(builds.primaryView).toBe('All Failed');
					expect(builds.views.length).toBe(8);
					return true;
				});
			});

		});
	});

});
