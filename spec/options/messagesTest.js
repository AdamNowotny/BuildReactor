define(['options/messages'], function (messages) {

	'use strict';

	describe('options/messages', function () {

		beforeEach(function () {
			spyOn(chrome.runtime, 'sendMessage');
		});

		it('should send initOptions message', function () {
			var callback = function () {};

			messages.initOptions(callback);

			expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({name: "initOptions"}, callback);
		});

		it('should send updateSettings message', function () {
			var settings = [];

			messages.updateSettings(settings);

			expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({name: "updateSettings", settings: settings});
		});

		it('should send availableProjects message', function () {
			var settings = [];
			var callback = function () {};

			messages.availableProjects(settings, callback);

			expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({name: "availableProjects", serviceSettings: settings}, callback);
		});
	});

});