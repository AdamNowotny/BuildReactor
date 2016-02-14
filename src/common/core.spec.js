define([
	'common/core',
	'common/chromeApi',
	'rx',
	'test/rxHelpers',
	'rx.binding'
], function (core, chromeApi, Rx) {

	'use strict';

	describe('common/core', function () {

		var onNext = Rx.ReactiveTest.onNext;
		var scheduler;
		var statePort, configPort, viewsPort;

		var createPort = function () {
			return {
				onMessage: {
					addListener: function () {}
				}
			};
		};

		beforeEach(function () {
			scheduler = new Rx.TestScheduler();
			statePort = createPort();
			configPort = createPort();
			viewsPort = createPort();
			spyOn(chromeApi, 'connect').andCallFake(function (request) {
				var ports = {
					'state': statePort,
					'configuration': configPort,
					'views': viewsPort
				};
				return ports[request.name];
			});
			spyOn(chromeApi, 'sendMessage');
			spyOn(statePort.onMessage, 'addListener');
			spyOn(configPort.onMessage, 'addListener');
			spyOn(viewsPort.onMessage, 'addListener');
		});

		it('should connect on init', function () {
			core.init();

			expect(chromeApi.connect.argsForCall[0]).toEqual([{ name: 'state' }]);
			expect(chromeApi.connect.argsForCall[1]).toEqual([{ name: 'configuration' }]);
			expect(chromeApi.connect.argsForCall[2]).toEqual([{ name: 'views' }]);
		});

		it('should pass activeProjects from port', function () {
			var state = [{ name: 'service1' }, { name: 'service2' }];
			statePort.onMessage.addListener.andCallFake(function (listener) {
				listener(state);
			});

			scheduler.scheduleAbsolute(300, function () {
				core.init();
			});
			var result = scheduler.startWithCreate(function () {
				return core.activeProjects;
			});

			expect(result.messages).toHaveElements(onNext(300, state));
		});

		it('should pass configurations from port', function () {
			var config = [{ name: 'service1' }, { name: 'service2' }];
			configPort.onMessage.addListener.andCallFake(function (listener) {
				listener(config);
			});

			scheduler.scheduleAbsolute(300, function () {
				core.init();
			});
			var result = scheduler.startWithCreate(function () {
				return core.configurations;
			});

			expect(result.messages).toHaveElements(onNext(300, config));
		});

		it('should pass view configurations from port', function () {
			var config = [{ columns: 5 }];
			viewsPort.onMessage.addListener.andCallFake(function (listener) {
				listener(config);
			});

			scheduler.scheduleAbsolute(300, function () {
				core.init();
			});
			var result = scheduler.startWithCreate(function () {
				return core.views;
			});

			expect(result.messages).toHaveElements(onNext(300, config));
		});

		it('should send availableServices message', function () {
			var callback = function () {};

			core.availableServices(callback);

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "availableServices" }, callback);
		});

		it('should send availableProjects message', function () {
			var settings = [];
			var callback = jasmine.createSpy();
			chromeApi.sendMessage.andCallFake(function (message, callback) {
				callback('result');
			});

			core.availableProjects(settings, callback);

			expect(chromeApi.sendMessage).toHaveBeenCalled();
			expect(chromeApi.sendMessage.mostRecentCall.args[0]).toEqual({ name: "availableProjects", serviceSettings: settings });
			expect(callback).toHaveBeenCalled();
		});

		it('should send enableService message', function () {
			core.enableService('service');

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "enableService", serviceName: 'service' });
		});

		it('should send disableService message', function () {
			core.disableService('service');

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "disableService", serviceName: 'service' });
		});

		it('should send removeService message', function () {
			core.removeService('service');

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "removeService", serviceName: 'service' });
		});

		it('should send renameService message', function () {
			core.renameService('service', 'new service');

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({
				name: "renameService",
				oldName: 'service',
				newName: 'new service'
			});
		});

		it('should send setOrder message', function () {
			core.setOrder(['service2', 'service1']);

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "setOrder", order: ['service2', 'service1'] });
		});

		it('should send setBuildOrder message', function () {
			core.setBuildOrder('service name', ['build2', 'build1']);

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "setBuildOrder", serviceName: 'service name', order: ['build2', 'build1'] });
		});

		it('should send setViews message', function () {
			core.setViews({ columns: 5 });

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "setViews", views: { columns: 5 } });
		});

		it('should send saveConfig message', function () {
			var config = [{ name: 'service' }];

			core.saveConfig(config);

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({ name: "saveConfig", config: config });
		});

	});

});
