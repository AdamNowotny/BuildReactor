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

		var messageHandler, connectHandler;
		var port;

		beforeEach(function () {
			spyOn(chromeApi, 'addMessageListener').andCallFake(function (messageListener) {
				messageHandler = messageListener;
			});
			spyOn(chromeApi, 'addConnectListener').andCallFake(function (connectListener) {
				connectHandler = connectListener;
			});
			spyOn(serviceConfiguration, 'setOrder');
			spyOn(serviceConfiguration, 'enableService');
			spyOn(serviceConfiguration, 'disableService');
			spyOn(serviceConfiguration, 'removeService');
			spyOn(serviceConfiguration, 'renameService');
			spyOn(serviceConfiguration, 'saveService');
			spyOn(serviceConfiguration, 'getAll');
			spyOn(serviceConfiguration, 'setAll');
			spyOn(serviceController, 'getAllTypes');
			messageHandlers.init();
		});

		afterEach(function () {
			if (port && port.disconnectHandler) {
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

		describe('messages', function () {

			it('should handle availableServices', function () {
				var serviceTypes = [{ typeName: 'snap' }];
				serviceController.getAllTypes.andReturn(serviceTypes);

				var result;
				messageHandler({ name: 'availableServices'}, null, function (response) {
					result = response;
				});

				expect(result).toEqual(serviceTypes);
			});

			it('should handle updateSettings', function () {
				var settings = [{ name: 'service'}];
				messageHandler({ name: 'updateSettings', settings: settings}, null, null);

				expect(serviceConfiguration.setAll).toHaveBeenCalledWith(settings);
			});

			it('should handle setOrder', function () {
				var serviceNames = [ 'service2', 'service1' ];
				messageHandler({ name: 'setOrder', order: serviceNames}, null, null);

				expect(serviceConfiguration.setOrder).toHaveBeenCalledWith(serviceNames);
			});

			it('should handle enableService', function () {
				messageHandler({ name: 'enableService', serviceName: 'service'}, null, null);

				expect(serviceConfiguration.enableService).toHaveBeenCalledWith('service');
			});

			it('should handle disableService', function () {
				messageHandler({ name: 'disableService', serviceName: 'service'}, null, null);

				expect(serviceConfiguration.disableService).toHaveBeenCalledWith('service');
			});

			it('should handle removeService', function () {
				messageHandler({ name: 'removeService', serviceName: 'service'}, null, null);

				expect(serviceConfiguration.removeService).toHaveBeenCalledWith('service');
			});

			it('should handle renameService', function () {
				messageHandler({
					name: 'renameService',
					oldName: 'service',
					newName: 'new service'
				}, null, null);

				expect(serviceConfiguration.renameService).toHaveBeenCalledWith('service', 'new service');
			});

			it('should handle saveService', function () {
				var settings = { name: 'service', url: 'http://example.com/' };
				messageHandler({ name: 'saveService', settings: settings }, null, null);

				expect(serviceConfiguration.saveService).toHaveBeenCalledWith(settings);
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
				messageHandler(request, null, sendResponse);

				expect(serviceLoader.load).toHaveBeenCalled();
			});

			it('should call service', function () {
				messageHandler(request, null, sendResponse);

				expect(service.availableBuilds).toHaveBeenCalled();
			});

			it('should send response back', function () {
				var serviceResponse = {};
				var actualResponse;
				var sendResponse = function (response) {
					actualResponse = response;
				};
				mockAvailableBuilds.andReturn(Rx.Observable.returnValue(serviceResponse));

				messageHandler(request, null, sendResponse);

				expect(actualResponse.projects).toBe(serviceResponse);
			});

			it('should send error back', function () {
				var serviceError = {};
				var actualResponse;
				var sendResponse = function (response) {
					actualResponse = response;
				};
				mockAvailableBuilds.andReturn(Rx.Observable.throwException(serviceError));

				messageHandler(request, null, sendResponse);

				expect(actualResponse.error).toBe(serviceError);
			});

		});

		describe('activeProjects', function () {

			it('should subscribe to state sequence on connect', function () {
				port = openPort('state');
				connectHandler(port);

				serviceController.activeProjects.onNext([{ name: 'service 1', items: [] }]);

				expect(port.postMessage).toHaveBeenCalled();
			});

			it('should unsubscribe from state changes on disconnect', function () {
				port = openPort('state');
				connectHandler(port);
				port.disconnectHandler(port);

				serviceController.activeProjects.onNext('test');
				serviceController.activeProjects.onNext('test');
				serviceController.activeProjects.onNext('test');

				expect(port.postMessage.callCount).toBe(1);
			});

		});


	});
});