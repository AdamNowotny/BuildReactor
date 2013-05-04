define([
	'main/messageHandlers',
	'main/serviceLoader',
	'main/serviceController',
	'rx'
], function (messageHandlers, serviceLoader, serviceController, Rx) {
	'use strict';

	describe('messageHandlers', function () {

		var handler;
		var connectHandler;
		var disconnectHandler;
		var stateChangesPort = {
			name: 'stateChanges',
			postMessage: function () {},
			onDisconnect: {
				addListener: function () {}
			}
		};

		beforeEach(function () {
			spyOn(chrome.runtime.onMessage, 'addListener').andCallFake(function (handlerFunction) {
				handler = handlerFunction;
			});
			spyOn(chrome.runtime.onConnect, 'addListener').andCallFake(function (onConnect) {
				connectHandler = onConnect;
			});
			spyOn(stateChangesPort.onDisconnect, 'addListener').andCallFake(function (onDisconnect) {
				disconnectHandler = onDisconnect;
			});
			spyOn(stateChangesPort, 'postMessage');
			messageHandlers.init();
		});

		afterEach(function () {
			disconnectHandler(stateChangesPort);
		});

		describe('state', function () {

			it('should subscribe to state sequence on connect', function () {
				connectHandler(stateChangesPort);

				serviceController.events.onNext({ eventName: 'buildBroken' });

				expect(stateChangesPort.postMessage).toHaveBeenCalled();
			});

			it('should unsubscribe from events on disconnect', function () {
				connectHandler(stateChangesPort);
				disconnectHandler(stateChangesPort);

				serviceController.events.onNext('test');
				serviceController.events.onNext('test');
				serviceController.events.onNext('test');

				expect(stateChangesPort.postMessage.callCount).toBe(1);
			});

			it('should push message on event', function () {
				connectHandler(stateChangesPort);
				var lastMessage;
				messageHandlers.messages.subscribe(function (message) {
					lastMessage = message;
				});

				serviceController.events.onNext({ eventName: 'buildBroken' });

				expect(lastMessage).toBeDefined();
			});
		});

		describe('availableProjects', function () {

			var CustomBuildService = function () {};
			CustomBuildService.prototype.availableBuilds = function () {};

			var service;
			var sendResponse;
			var request;
			var mockAvailableBuilds;

			beforeEach(function () {
				service = new CustomBuildService();
				spyOn(serviceLoader, 'load').andCallFake(function () {
					return Rx.Observable.returnValue(new CustomBuildService());
				});
				sendResponse = jasmine.createSpy();
				request = {
					name: 'availableProjects',
					serviceSettings: {}
				};
				mockAvailableBuilds = spyOn(CustomBuildService.prototype, 'availableBuilds').andCallFake(function () {
					return Rx.Observable.never();
				});

			});

			it('should create service', function () {
				handler(request, null, sendResponse);

				expect(serviceLoader.load).toHaveBeenCalled();
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