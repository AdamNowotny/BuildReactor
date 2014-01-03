/* global chrome: false */
define([
	'core/badgeController',
	'core/services/serviceController',
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

		it('should not show badge when services are initialized and builds are fine', function () {
			serviceController.events.onNext({ eventName: 'servicesInitialized' });

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('');
		});

		it('should not show badge when all builds are fixed', function () {
			serviceController.events.onNext({ eventName: 'servicesInitialized' });

			serviceController.events.onNext({ eventName: 'buildBroken' });
			serviceController.events.onNext({ eventName: 'buildFixed' });

			expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('');
		});

		describe('red badge', function () {

			it('should reset count when services are reloaded', function () {
				serviceController.events.onNext({ eventName: 'buildBroken' });
				serviceController.events.onNext({ eventName: 'buildBroken' });

				serviceController.events.onNext({ eventName: 'servicesInitializing' });
				serviceController.events.onNext({ eventName: 'buildBroken' });

				expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('1');
			});

			it('should show red badge when a build is broken', function () {
				serviceController.events.onNext({ eventName: 'servicesInitialized' });

				serviceController.events.onNext({ eventName: 'buildBroken' });

				expect(chrome.browserAction.setBadgeBackgroundColor.mostRecentCall.args[0].color).toEqual(colors.red);
			});

			it('should increase amount of failed builds when builds fail', function () {
				serviceController.events.onNext({ eventName: 'buildBroken' });
				serviceController.events.onNext({ eventName: 'buildBroken' });

				expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('2');
			});

			it('should decrease amount of failed builds when builds are fixed', function () {
				serviceController.events.onNext({ eventName: 'buildBroken' });
				serviceController.events.onNext({ eventName: 'buildBroken' });
				serviceController.events.onNext({ eventName: 'buildFixed' });

				expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('1');
			});

			it('should ignore broken builds if build disabled', function () {
				serviceController.events.onNext({ eventName: 'servicesInitialized' });

				serviceController.events.onNext({ eventName: 'buildBroken', details: { isDisabled: true } });

				expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('');
				expect(chrome.browserAction.setBadgeBackgroundColor.mostRecentCall.args[0].color).not.toEqual(colors.red);
			});

			it('should ignore fixed builds if build disabled', function () {
				serviceController.events.onNext({ eventName: 'servicesInitialized' });

				serviceController.events.onNext({ eventName: 'buildBroken' });
				serviceController.events.onNext({ eventName: 'buildBroken' });
				serviceController.events.onNext({ eventName: 'buildFixed', details: { isDisabled: true } });

				expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe('2');
			});

		});

		describe('grey badge', function () {

			it('should show grey badge when services are reloaded', function () {
				serviceController.events.onNext({ eventName: 'servicesInitializing' });

				expect(chrome.browserAction.setBadgeText.mostRecentCall.args[0].text).toBe(' ');
				expect(chrome.browserAction.setBadgeBackgroundColor.mostRecentCall.args[0].color).toEqual(colors.grey);
			});

			it('should show grey badge if build offline', function () {
				serviceController.events.onNext({ eventName: 'servicesInitialized' });

				serviceController.events.onNext({ eventName: 'buildOffline' });

				expect(chrome.browserAction.setBadgeBackgroundColor.mostRecentCall.args[0].color).toEqual(colors.grey);
			});

			it('should show grey badge if build offline and another failed', function () {
				serviceController.events.onNext({ eventName: 'servicesInitialized' });

				serviceController.events.onNext({ eventName: 'buildBroken' });
				serviceController.events.onNext({ eventName: 'buildOffline' });

				expect(chrome.browserAction.setBadgeBackgroundColor.mostRecentCall.args[0].color).toEqual(colors.grey);
			});

			it('should not show grey badge if builds back online', function () {
				serviceController.events.onNext({ eventName: 'servicesInitialized' });

				serviceController.events.onNext({ eventName: 'buildOffline' });
				serviceController.events.onNext({ eventName: 'buildOnline' });

				expect(chrome.browserAction.setBadgeBackgroundColor.mostRecentCall.args[0].color).not.toEqual(colors.grey);
			});

		});

	});

});