import { beforeAll, expect, it, vi } from 'vitest';
import badge from './badge';
import stateStorage from './storage/service-state';

const mockChrome = {
    action: {
        setBadgeText: vi.fn(),
        setBadgeBackgroundColor: vi.fn(),
    },
};
vi.stubGlobal('chrome', mockChrome);
vi.mock('common/logger');

beforeAll(() => {
    badge.init();
});

it('hides badge when state empty', () => {
    stateStorage.onChanged.onNext({ oldValue: [], newValue: [] });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: '' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'green',
    });
});

it('shows badge when builds green', () => {
    stateStorage.onChanged.onNext({
        oldValue: [],
        newValue: [{ failedCount: 0, runningCount: 0, offlineCount: 0, name: 'service' }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: ' ' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'green',
    });
});

it('orange badge when builds running', () => {
    stateStorage.onChanged.onNext({
        oldValue: [],
        newValue: [{ failedCount: 0, runningCount: 2, offlineCount: 0, name: 'service' }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: ' ' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'orange',
    });
});

it('orange badge when builds running and failed', () => {
    stateStorage.onChanged.onNext({
        oldValue: [],
        newValue: [{ failedCount: 1, runningCount: 2, offlineCount: 0, name: 'service' }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: '1' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'orange',
    });
});

it('grey badge when builds offline', () => {
    stateStorage.onChanged.onNext({
        oldValue: [],
        newValue: [{ failedCount: 0, runningCount: 0, offlineCount: 2, name: 'service' }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: ' ' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'gray',
    });
});

it('grey badge when builds offline and failed', () => {
    stateStorage.onChanged.onNext({
        oldValue: [],
        newValue: [{ failedCount: 1, runningCount: 0, offlineCount: 2, name: 'service' }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: '1' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'gray',
    });
});

it('red badge when builds failed', () => {
    stateStorage.onChanged.onNext({
        oldValue: [],
        newValue: [{ failedCount: 1, runningCount: 0, offlineCount: 0, name: 'service' }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: '1' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'red',
    });
});
