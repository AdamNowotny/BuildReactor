define(['common/core', 'common/chromeApi'], function (core, chromeApi) {

	'use strict';

	describe('common/core', function () {

		var port;
		var publishMessage;

		beforeEach(function () {
			port = {
				onMessage: {
					addListener: function () {}
				}
			};
			spyOn(chromeApi, 'connect').andReturn(port);
			spyOn(chromeApi, 'sendMessage');
			spyOn(port.onMessage, 'addListener').andCallFake(function (listener) {
				publishMessage = listener;
			});
		});

		it('should connect on init', function () {
			core.init();

			expect(chromeApi.connect).toHaveBeenCalledWith({ name: 'state' });
		});

		it('should subscribe on init', function () {
			var message;
			var settings = [];
			var subscription = core.activeProjects.subscribe(function (state) {
				message = state;
			});

			core.init();
			publishMessage(settings);

			subscription.dispose();
			expect(message).toBe(settings);
		});

		it('should send initOptions message', function () {
			var callback = function () {};

			core.initOptions(callback);

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({name: "initOptions"}, callback);
		});

		it('should send updateSettings message', function () {
			var settings = [];

			core.updateSettings(settings);

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({name: "updateSettings", settings: settings});
		});

		it('should send availableProjects message', function () {
			var settings = [];
			var callback = function () {};

			core.availableProjects(settings, callback);

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({name: "availableProjects", serviceSettings: settings}, callback);
		});

		it('should send enableService message', function () {
			core.enableService('service');

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({name: "enableService", serviceName: 'service'});
		});

		it('should send disableService message', function () {
			core.disableService('service');

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({name: "disableService", serviceName: 'service'});
		});


	});

});