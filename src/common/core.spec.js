define(['common/core', 'common/chromeApi'], function (core, chromeApi) {

	'use strict';

	describe('common/core', function () {

		beforeEach(function () {
			spyOn(chromeApi, 'sendMessage');
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
	});

});