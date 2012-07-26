define([
	'badgeController',
	'serviceController',
	'spec/mocks/mockBuildEvent'
], function (badgeController, serviceController, mockBuildEvent) {

	'use strict';
	
	var colors = {
		grey: [200, 200, 200, 200],
		red: [255, 0, 0, 200]
	};

	describe('badgeController', function () {

		beforeEach(function () {
			spyOn(chrome.browserAction, 'setBadgeText');
			spyOn(chrome.browserAction, 'setBadgeBackgroundColor');
		});

		afterEach(function () {
			serviceController.startedLoading.removeAll();
			serviceController.servicesStarted.removeAll();
			serviceController.buildFailed.removeAll();
			serviceController.buildFixed.removeAll();
		});

		it('should show grey badge when services are reloaded', function () {
			badgeController();

			serviceController.startedLoading.dispatch();

			expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: ' ' });
			expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: colors.grey });
		});

		it('should reset count when services are reloaded', function () {
			badgeController();
			var buildEvent = mockBuildEvent();
			serviceController.buildFailed.dispatch(buildEvent);
			serviceController.buildFailed.dispatch(buildEvent);

			serviceController.startedLoading.dispatch();
			serviceController.buildFailed.dispatch(buildEvent);

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('1');
		});

		it('should not show badge when services are initialized and builds are fine', function () {
			badgeController();

			serviceController.servicesStarted.dispatch();

			expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '' });
		});

		it('should show red badge if build failed before all services started', function () {
			badgeController();

			serviceController.buildFailed.dispatch(mockBuildEvent());
			serviceController.servicesStarted.dispatch();

			expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: colors.red });
			expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '1' });
			expect(chrome.browserAction.setBadgeText).not.toHaveBeenCalledWith({ text: '' });
		});

		it('should show red badge when a build is broken', function () {
			badgeController();

			serviceController.buildFailed.dispatch(mockBuildEvent());

			expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: colors.red });
		});

		it('should increase amount of failed builds when builds fail', function () {
			badgeController();

			serviceController.buildFailed.dispatch(mockBuildEvent());
			serviceController.buildFailed.dispatch(mockBuildEvent());

			expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '2' });
			expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: colors.red });
		});

		it('should decrease amount of failed builds when builds are fixed', function () {
			badgeController();

			serviceController.buildFailed.dispatch(mockBuildEvent());
			serviceController.buildFailed.dispatch(mockBuildEvent());
			serviceController.buildFixed.dispatch(mockBuildEvent());

			expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '1' });
			expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: colors.red });
		});

		it('should not show badge when all builds are fixed', function () {
			badgeController();
			serviceController.servicesStarted.dispatch();

			serviceController.buildFailed.dispatch(mockBuildEvent());
			serviceController.buildFixed.dispatch(mockBuildEvent());

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('');
		});

	});

});