/* global chrome: false */
import badgeController from 'core/badgeController';
import events from 'core/events';

const colors = {
	grey: [200, 200, 200, 200],
	red: [255, 0, 0, 200]
};

describe('badgeController', () => {

	beforeEach(() => {
		events.reset();
		spyOn(chrome.browserAction, 'setBadgeText');
		spyOn(chrome.browserAction, 'setBadgeBackgroundColor');
		badgeController.init();
	});

	it('should not show badge when services are initialized and builds are fine', () => {
		events.push({ eventName: 'servicesInitialized' });

		expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('');
	});

	it('should not show badge when all builds are fixed', () => {
		events.push({ eventName: 'servicesInitialized' });

		events.push({ eventName: 'buildFinished', broken: true });
		events.push({ eventName: 'buildFinished', fixed: true });

		expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('');
	});

	describe('red badge', () => {

		it('should reset count when services are reloaded', () => {
			events.push({ eventName: 'buildFinished', broken: true });
			events.push({ eventName: 'buildFinished', broken: true });

			events.push({ eventName: 'servicesInitializing' });
			events.push({ eventName: 'buildFinished', broken: true });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('1');
		});

		it('should show red badge when a build is broken', () => {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildFinished', broken: true });

			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.red);
		});

		it('should increase amount of failed builds when builds fail', () => {
			events.push({ eventName: 'buildFinished', broken: true });
			events.push({ eventName: 'buildFinished', broken: true });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('2');
		});

		it('should decrease amount of failed builds when builds are fixed', () => {
			events.push({ eventName: 'buildFinished', broken: true });
			events.push({ eventName: 'buildFinished', broken: true });
			events.push({ eventName: 'buildFinished', fixed: true });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('1');
		});

		it('should not show less than 0 failed builds', () => {
			events.push({ eventName: 'buildFinished', fixed: true });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe(' ');
		});

		it('should ignore broken builds if build disabled', () => {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildFinished', broken: true, details: { isDisabled: true } });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('');
			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).not.toEqual(colors.red);
		});

		it('should ignore fixed builds if build disabled', () => {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildFinished', broken: true });
			events.push({ eventName: 'buildFinished', broken: true });
			events.push({ eventName: 'buildFinished', fixed: true, details: { isDisabled: true } });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('2');
		});

	});

	describe('grey badge', () => {

		it('should show grey badge when services are reloaded', () => {
			events.push({ eventName: 'servicesInitializing' });

			expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe(' ');
			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.grey);
		});

		it('should show grey badge if build offline', () => {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildOffline' });

			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.grey);
		});

		it('should show grey badge if build offline and another failed', () => {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildFinished', broken: true });
			events.push({ eventName: 'buildOffline' });

			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.grey);
		});

		it('should not show grey badge if builds back online', () => {
			events.push({ eventName: 'servicesInitialized' });

			events.push({ eventName: 'buildOffline' });
			events.push({ eventName: 'buildOnline' });

			expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).not.toEqual(colors.grey);
		});

	});

});
