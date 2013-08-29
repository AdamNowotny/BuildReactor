define(['options/messages', 'common/chromeApi'], function (messages, chromeApi) {

	'use strict';

	describe('options/messages', function () {

		beforeEach(function () {
			spyOn(chromeApi, 'sendMessage');
		});

		it('should send initOptions message', function () {
			var callback = function () {};

			messages.initOptions(callback);

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({name: "initOptions"}, callback);
		});

		it('should send updateSettings message', function () {
			var settings = [];

			messages.updateSettings(settings);

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({name: "updateSettings", settings: settings});
		});

		it('should send availableProjects message', function () {
			var settings = [];
			var callback = function () {};

			messages.availableProjects(settings, callback);

			expect(chromeApi.sendMessage).toHaveBeenCalledWith({name: "availableProjects", serviceSettings: settings}, callback);
		});
	});

});