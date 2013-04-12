define([
	'main/messageHandlers',
	'main/serviceRepository',
	'signals',
	'rx',
	'spec/mocks/buildService'
], function (messageHandlers, serviceRepository, Signal, Rx, MockBuildService) {
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
			var mockAvailableBuilds;

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

				mockAvailableBuilds = spyOn(service, 'availableBuilds').andCallFake(function () {
					return Rx.Observable.never();
				});

			});

			it('should create service', function () {
				handler(request, null, sendResponse);

				expect(serviceRepository.create).toHaveBeenCalled();
			});

			it('should call service', function () {
				handler(request, null, sendResponse);

				expect(service.availableBuilds).toHaveBeenCalled();
			});

			it('should send response back', function () {
				var serviceResponse = {};
				var actualResponse;
				var sendResponse = function (response) {
					actualResponse = response;
				};
				mockAvailableBuilds.andReturn(Rx.Observable.returnValue(serviceResponse));

				handler(request, null, sendResponse);

				expect(actualResponse.projects).toBe(serviceResponse);
			});

			it('should send error back', function () {
				var serviceError = {};
				var actualResponse;
				var sendResponse = function (response) {
					actualResponse = response;
				};
				mockAvailableBuilds.andReturn(Rx.Observable.throwException(serviceError));

				handler(request, null, sendResponse);

				expect(actualResponse.error).toBe(serviceError);
			});

		});

	});
});