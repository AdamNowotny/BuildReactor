/* global chrome: false */
import badgeController from 'core/badgeController';
import events from 'core/events';

var colors = {
	grey: [200, 200, 200, 200],
	red: [255, 0, 0, 200]
};

describe('badgeController', function() {

	beforeEach(function() {
		events.reset();
		spyOn(chrome.browserAction, 'setBadgeText');
		spyOn(chrome.browserAction, 'setBadgeBackgroundColor');
		badgeController.init();
	});

	it('should not show badge when services are initialized and builds are fine', function() {
		events.push({ eventName: 'servicesInitialized' });

		expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('');
	});

	it('should not show badge when all builds are fixed', function() {
		events.push({ eventName: 'servicesInitialized' });

		events.push({ eventName: 'buildBroken' });
		events.push({ eventName: 'buildFixed' });

		expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('');
	});

	describe('red badge', function() {

		it('should reset count when services are reloaded', function() {
			events.push({ eventName: 'buildBroken' });
			events.push({ eventName: 'buildBroken' });

			events.push({ eventName: 'servicesInitializing' });
			events.push({ eventName: 'buildBroken' });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('1');
		});

		it('should show red badge when a build is broken', function() {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildBroken' });

			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.red);
		});

		it('should increase amount of failed builds when builds fail', function() {
			events.push({ eventName: 'buildBroken' });
			events.push({ eventName: 'buildBroken' });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('2');
		});

		it('should decrease amount of failed builds when builds are fixed', function() {
			events.push({ eventName: 'buildBroken' });
			events.push({ eventName: 'buildBroken' });
			events.push({ eventName: 'buildFixed' });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('1');
		});

		it('should not show less than 0 failed builds', function() {
			events.push({ eventName: 'buildFixed' });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe(' ');
		});

		it('should ignore broken builds if build disabled', function() {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildBroken', details: { isDisabled: true } });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('');
			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).not.toEqual(colors.red);
		});

		it('should ignore fixed builds if build disabled', function() {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildBroken' });
			events.push({ eventName: 'buildBroken' });
			events.push({ eventName: 'buildFixed', details: { isDisabled: true } });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('2');
		});

	});

	describe('grey badge', function() {

		it('should show grey badge when services are reloaded', function() {
			events.push({ eventName: 'servicesInitializing' });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe(' ');
			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.grey);
		});

		it('should show grey badge if build offline', function() {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildOffline' });

			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.grey);
		});

		it('should show grey badge if build offline and another failed', function() {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildBroken' });
			events.push({ eventName: 'buildOffline' });

			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.grey);
		});

		it('should not show grey badge if builds back online', function() {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildOffline' });
			events.push({ eventName: 'buildOnline' });

			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).not.toEqual(colors.grey);
		});

	});

});
