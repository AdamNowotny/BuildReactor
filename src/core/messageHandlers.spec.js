define([
	'core/messageHandlers',
	'core/services/serviceLoader',
	'core/services/serviceController',
	'core/services/serviceConfiguration',
	'rx',
	'common/chromeApi'
], function (messageHandlers, serviceLoader, serviceController, serviceConfiguration, Rx, chromeApi) {
	'use strict';

	describe('messageHandlers', function () {

		var port;
		var handler;
		var connectHandler;

		beforeEach(function () {
			spyOn(chromeApi, 'addMessageListener').andCallFake(function (handlerFunction) {
				handler = handlerFunction;
			});
			spyOn(chromeApi, 'addConnectListener').andCallFake(function (onConnect) {
				connectHandler = onConnect;
			});
			spyOn(serviceConfiguration, 'enableService');
			spyOn(serviceConfiguration, 'disableService');
			spyOn(serviceConfiguration, 'getAll');
			spyOn(serviceConfiguration, 'setAll');
			spyOn(serviceController, 'getAllTypes');
			port = openPort('popup');
			messageHandlers.init();
		});

		afterEach(function () {
			if (port.disconnectHandler) {
				port.disconnectHandler(port);
			}
		});

		function openPort(portName) {
			var port = {
				name: portName,
				postMessage: function () {},
				onDisconnect: {
					addListener: function () {}
				}
			};
			spyOn(port.onDisconnect, 'addListener').andCallFake(function (onDisconnect) {
				port.disconnectHandler = onDisconnect;
			});
			spyOn(port, 'postMessage');
			return port;
		}

		it('should handle enableService', function () {
			handler({ name: 'enableService', serviceName: 'service'}, null, null);

			expect(serviceConfiguration.enableService).toHaveBeenCalledWith('service');
		});

		it('should handle disableService', function () {
			handler({ name: 'disableService', serviceName: 'service'}, null, null);

			expect(serviceConfiguration.disableService).toHaveBeenCalledWith('service');
		});

		it('should handle updateSettings', function () {
			var settings = [{ name: 'service'}];
			handler({ name: 'updateSettings', settings: settings}, null, null);

			expect(serviceConfiguration.setAll).toHaveBeenCalledWith(settings);
		});

		it('should handle initOptions', function () {
			var settings = [{ name: 'service'}];
			var serviceTypes = [{ typeName: 'snap' }];
			serviceConfiguration.getAll.andReturn(settings);
			serviceController.getAllTypes.andReturn(serviceTypes);
			var result;
			var sendResponse = function (response) {
				result = response;
			};

			handler({ name: 'initOptions'}, null, sendResponse);

			expect(result).toEqual({
				settings: settings,
				serviceTypes: serviceTypes
			});
		});

		describe('activeProjects', function () {

			it('should subscribe to state sequence on connect', function () {
				connectHandler(port);

				serviceController.activeProjects.onNext([{ name: 'service 1', items: [] }]);

				expect(port.postMessage).toHaveBeenCalled();
			});

			it('should unsubscribe from state changes on disconnect', function () {
				connectHandler(port);
				port.disconnectHandler(port);

				serviceController.activeProjects.onNext('test');
				serviceController.activeProjects.onNext('test');
				serviceController.activeProjects.onNext('test');

				expect(port.postMessage.callCount).toBe(1);
			});

			it('should unsubscribe from right channel', function () {
				var popupPort = openPort('popup');
				var dashboardPort = openPort('dashboard');

				connectHandler(popupPort);
				connectHandler(dashboardPort);
				popupPort.disconnectHandler(popupPort);
				serviceController.activeProjects.onNext('test');
				serviceController.activeProjects.onNext('test');
				serviceController.activeProjects.onNext('test');

				expect(popupPort.postMessage.callCount).toBe(1);
				expect(dashboardPort.postMessage.callCount).toBe(4);
			});

			it('should push message on event', function () {
				connectHandler(port);
				var lastMessage;
				messageHandlers.messages.subscribe(function (message) {
					lastMessage = message;
				});

				serviceController.activeProjects.onNext([{ name: 'service 1', items: [] }]);

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