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
			serviceController.on.reset.removeAll();
			serviceController.on.startedAll.removeAll();
			serviceController.on.brokenBuild.removeAll();
			serviceController.on.fixedBuild.removeAll();
		});

		it('should show grey badge when services are reloaded', function () {
			badgeController();

			serviceController.on.reset.dispatch();

			expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: ' ' });
			expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: colors.grey });
		});

		it('should reset count when services are reloaded', function () {
			badgeController();
			var buildEvent = mockBuildEvent();
			serviceController.on.brokenBuild.dispatch(buildEvent);
			serviceController.on.brokenBuild.dispatch(buildEvent);

			serviceController.on.reset.dispatch();
			serviceController.on.brokenBuild.dispatch(buildEvent);

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('1');
		});

		it('should not show badge when services are initialized and builds are fine', function () {
			badgeController();

			serviceController.on.startedAll.dispatch();

			expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '' });
		});

		it('should show red badge if build failed before all services started', function () {
			badgeController();

			serviceController.on.brokenBuild.dispatch(mockBuildEvent());
			serviceController.on.startedAll.dispatch();

			expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: colors.red });
			expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '1' });
			expect(chrome.browserAction.setBadgeText).not.toHaveBeenCalledWith({ text: '' });
		});

		it('should show red badge when a build is broken', function () {
			badgeController();

			serviceController.on.brokenBuild.dispatch(mockBuildEvent());

			expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: colors.red });
		});

		it('should increase amount of failed builds when builds fail', function () {
			badgeController();

			serviceController.on.brokenBuild.dispatch(mockBuildEvent());
			serviceController.on.brokenBuild.dispatch(mockBuildEvent());

			expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '2' });
			expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: colors.red });
		});

		it('should decrease amount of failed builds when builds are fixed', function () {
			badgeController();

			serviceController.on.brokenBuild.dispatch(mockBuildEvent());
			serviceController.on.brokenBuild.dispatch(mockBuildEvent());
			serviceController.on.fixedBuild.dispatch(mockBuildEvent());

			expect(chrome.browserAction.setBadgeText).toHaveBeenCalledWith({ text: '1' });
			expect(chrome.browserAction.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: colors.red });
		});

		it('should not show badge when all builds are fixed', function () {
			badgeController();
			serviceController.on.startedAll.dispatch();

			serviceController.on.brokenBuild.dispatch(mockBuildEvent());
			serviceController.on.fixedBuild.dispatch(mockBuildEvent());

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('');
		});

	});

});