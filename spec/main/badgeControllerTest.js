define([
	'main/badgeController',
	'main/serviceController',
	'rx'
], function (badgeController, serviceController, Rx) {

	'use strict';
	
	var colors = {
		grey: [200, 200, 200, 200],
		red: [255, 0, 0, 200]
	};

	describe('badgeController', function () {

		var subscription;

		beforeEach(function () {
			spyOn(chrome.browserAction, 'setBadgeText');
			spyOn(chrome.browserAction, 'setBadgeBackgroundColor');
			subscription = badgeController();
		});

		afterEach(function () {
			subscription.dispose();
		});

		it('should show grey badge when services are reloaded', function () {
			serviceController.events.onNext({ eventName: 'servicesInitializing' });

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe(' ');
			expect(chrome.browserAction.setBadgeBackgroundColor.mostRecentCall.args[0].color).toEqual(colors.grey);
		});

		it('should reset count when services are reloaded', function () {
			serviceController.events.onNext({ eventName: 'buildBroken' });
			serviceController.events.onNext({ eventName: 'buildBroken' });

			serviceController.events.onNext({ eventName: 'servicesInitializing' });
			serviceController.events.onNext({ eventName: 'buildBroken' });

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('1');
		});

		it('should not show badge when services are initialized and builds are fine', function () {
			serviceController.events.onNext({ eventName: 'servicesInitialized' });

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('');
		});

		it('should show red badge if build failed before all services started', function () {
			serviceController.events.onNext({ eventName: 'buildBroken' });
			serviceController.events.onNext({ eventName: 'servicesInitialized' });

			expect(chrome.browserAction.setBadgeBackgroundColor.mostRecentCall.args[0].color).toEqual(colors.red);
			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('1');
			expect(chrome.browserAction.setBadgeText).not.toHaveBeenCalledWith({ text: '' });
		});

		it('should show red badge when a build is broken', function () {
			serviceController.events.onNext({ eventName: 'buildBroken' });


			expect(chrome.browserAction.setBadgeBackgroundColor.mostRecentCall.args[0].color).toEqual(colors.red);
		});

		it('should increase amount of failed builds when builds fail', function () {
			serviceController.events.onNext({ eventName: 'buildBroken' });
			serviceController.events.onNext({ eventName: 'buildBroken' });

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('2');
			expect(chrome.browserAction.setBadgeBackgroundColor.mostRecentCall.args[0].color).toEqual(colors.red);
		});

		it('should decrease amount of failed builds when builds are fixed', function () {
			serviceController.events.onNext({ eventName: 'buildBroken' });
			serviceController.events.onNext({ eventName: 'buildBroken' });
			serviceController.events.onNext({ eventName: 'buildFixed' });

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('1');
			expect(chrome.browserAction.setBadgeBackgroundColor.mostRecentCall.args[0].color).toEqual(colors.red);
		});

		it('should not show badge when all builds are fixed', function () {
			serviceController.events.onNext({ eventName: 'servicesInitialized' });

			serviceController.events.onNext({ eventName: 'buildBroken' });
			serviceController.events.onNext({ eventName: 'buildFixed' });

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('');
		});

	});

});