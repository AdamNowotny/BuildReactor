define([
	'main/messageHandlers',
	'main/serviceRepository',
	'signals',
	'spec/mocks/buildService'
], function (messageHandlers, serviceRepository, Signal, MockBuildService) {
	'use strict';

	describe('availableProjects', function () {

		var handler;

		beforeEach(function () {
			spyOn(chrome.extension.onMessage, 'addListener').andCallFake(function (handlerFunction) {
				handler = handlerFunction;
			});
			messageHandlers();
		});

		describe('availableProjects', function () {

			var serviceLoaded;
			var service;
			var sendResponse;
			var request;
			var receivedProjects;
			var errorThrown;

			beforeEach(function () {
				serviceLoaded = new Signal();
				serviceLoaded.memorize = true;
				service = new MockBuildService();
				serviceLoaded.dispatch(service);
				spyOn(serviceRepository, 'create').andReturn(serviceLoaded);

				sendResponse = jasmine.createSpy();

				request = {
					name: 'availableProjects',
					serviceSettings: {}
				};

				receivedProjects = new Signal();
				errorThrown = new Signal();
				spyOn(service, 'projects').andCallFake(function () {
					return {
						receivedProjects: receivedProjects,
						errorThrown: errorThrown
					};
				});

			});

			it('should create service', function () {
				handler(request, null, sendResponse);

				expect(serviceRepository.create).toHaveBeenCalled();
			});

			it('should get projects', function () {
				handler(request, null, sendResponse);

				expect(service.projects).toHaveBeenCalled();
			});

			it('should send projects back', function () {
				var projects = {};
				var responseSent = false;
				var sendResponse = function (response) {
					responseSent = true;
					expect(response.projects).toBe(projects);
				};

				handler(request, null, sendResponse);
				receivedProjects.dispatch(projects);

				expect(responseSent).toBe(true);
			});
			
			it('should send error back', function () {
				var errorInfo = {};
				var responseSent = false;
				var sendResponse = function (response) {
					responseSent = true;
					expect(response.error).toBe(errorInfo);
				};

				handler(request, null, sendResponse);
				errorThrown.dispatch(errorInfo);

				expect(responseSent).toBe(true);
			});

		});

	});
});