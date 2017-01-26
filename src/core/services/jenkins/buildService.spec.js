import Rx from 'rx/dist/rx.testing';

define([
	'core/services/jenkins/buildService',
	'core/services/jenkins/jenkinsBuild',
	'core/services/request',
	'raw!core/services/jenkins/availableBuilds.fixture.json',
	'raw!core/services/jenkins/availableBuilds.primaryView.fixture.json',
	'raw!core/services/jenkins/availableBuilds.incorrectUrl.fixture.json'
], function(BuildService, JenkinsBuild, request, availableBuildsFixture, viewFixture, availableBuildsIncorrectFixture) {

	'use strict';

	describe('core/services/jenkins/buildService', function() {

		var onNext = Rx.ReactiveTest.onNext;
		var onCompleted = Rx.ReactiveTest.onCompleted;
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
						return Rx.Observable.return(availableBuildsJson);
					} else if (options.url.indexOf('/view/') > -1) {
						return Rx.Observable.return(viewJson);
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
						return Rx.Observable.return(availableBuildsJson);
					} else if (options.url.indexOf('iew/') > -1) {
						expect(options.timeout).toBe(90000);
						return Rx.Observable.return(viewJson);
					}
					throw 'Unknown url: ' + options.url;
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should return projects', function() {
				var result = scheduler.startScheduler(function() {
					return service.availableBuilds();
				});

				const messageValue = result.messages[0].value.value;
				expect(messageValue.items.length).toBe(77);
				expect(messageValue.items[0].id).toBe('config-provider-model');
				expect(messageValue.items[0].name).toBe('config-provider-model');
				expect(messageValue.items[0].group).toBe(null);
				expect(messageValue.items[0].isDisabled).toBe(false);
			});

			it('should return views', function() {
				var result = scheduler.startScheduler(function() {
					return service.availableBuilds();
				});

				const messageValue = result.messages[0].value.value;
				expect(messageValue.primaryView).toBe('All Failed');
				expect(messageValue.views.length).toBe(8);
				expect(messageValue.views[0].name).toBe('All');
				expect(messageValue.views[0].items.length).toBe(16);
				expect(messageValue.views[0].items[0]).toBe('core_selenium-test');
			});

			it('should fix url to primaryView', function() {
				var availableBuildsJson = JSON.parse(availableBuildsIncorrectFixture);
				setupRequestSpy(availableBuildsJson, viewJson);

				var result = scheduler.startScheduler(function() {
					return service.availableBuilds();
				});

				const messageValue = result.messages[0].value.value;
				expect(messageValue.primaryView).toBe('All Failed');
				expect(messageValue.views.length).toBe(8);
			});

		});
	});

});
