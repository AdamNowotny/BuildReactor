define([
	'main/messageHandlers',
	'main/serviceRepository',
	'signals',
	'spec/mocks/buildService'
], function (messageHandlers, serviceRepository, Signal, MockBuildService) {
	'use strict';

	describe('messageHandlers', function () {

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
			var projectsSignal;
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

				projectsSignal = new Signal();
				errorThrown = new Signal();
				spyOn(service, 'projects').andCallFake(function () {
					return projectsSignal;
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
				var projectsResponse = {
					projects: {}
				};
				var responseSent = false;
				var sendResponse = function (response) {
					responseSent = true;
					expect(response).toBe(projectsResponse);
				};

				handler(request, null, sendResponse);
				projectsSignal.dispatch(projectsResponse);

				expect(responseSent).toBe(true);
			});

			it('should send error back', function () {
				var errorResponse = {
					error: {}
				};
				var responseSent = false;
				var sendResponse = function (response) {
					responseSent = true;
					expect(response).toBe(errorResponse);
				};

				handler(request, null, sendResponse);
				projectsSignal.dispatch(errorResponse);

				expect(responseSent).toBe(true);
			});

		});

	});
});