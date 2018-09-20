/* global chrome: false */
import badgeController from 'core/badgeController';
import events from 'core/events';

const colors = {
    grey: [200, 200, 200, 200],
    red: [255, 0, 0, 200],
    yellow: [255, 150, 0, 200]
};

describe('badgeController', () => {

    beforeEach(() => {
        events.reset();
        spyOn(chrome.browserAction, 'setBadgeText');
        spyOn(chrome.browserAction, 'setBadgeBackgroundColor');
        badgeController.init();
    });

    it('should not show badge when services are initialized and builds are fine', () => {
        events.push({ eventName: 'stateUpdated', details: [{ failedCount: 0 }] });
        events.push({ eventName: 'servicesInitialized' });

        expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('');
    });

    it('should not show badge when all builds are green', () => {
        events.push({ eventName: 'servicesInitialized' });

        events.push({ eventName: 'stateUpdated', details: [{ failedCount: 0 }] });

        expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('');
    });

    describe('red badge', () => {

        it('should show red badge when builds broken', () => {
            events.push({ eventName: 'servicesInitialized' });

            events.push({ eventName: 'stateUpdated', details: [{ failedCount: 2 }] });

            expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.red);
            expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('2');
        });

    });

    describe('grey badge', () => {

        it('should show grey badge when services are reloaded', () => {
            events.push({ eventName: 'servicesInitializing' });

            expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe(' ');
            expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.grey);
        });

        it('should show grey badge if some builds offline', () => {
            events.push({ eventName: 'servicesInitialized' });

            events.push({ eventName: 'stateUpdated', details: [{ offlineCount: 1, failedCount: 2, runningCount: 3 }] });

            expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('2');
            expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.grey);
        });

    });

    describe('yellow badge', () => {

        it('should show yellow badge when builds are running and green', () => {
            events.push({ eventName: 'servicesInitialized' });

            events.push({ eventName: 'stateUpdated', details: [{ runningCount: 1, failedCount: 0, offlineCount: 0 }] });

            expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe(' ');
            expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.yellow);
        });

        it('should show yellow badge with failed count when builds are running and some failed', () => {
            events.push({ eventName: 'servicesInitialized' });

            events.push({ eventName: 'stateUpdated', details: [{ runningCount: 1, failedCount: 2 }] });

            expect(chrome.browserAction.setBadgeText.calls.mostRecent().args[0].text).toBe('2');
            expect(chrome.browserAction.setBadgeBackgroundColor.calls.mostRecent().args[0].color).toEqual(colors.yellow);
        });

    });
});
