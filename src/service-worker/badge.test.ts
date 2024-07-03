import { beforeAll, expect, it, vi } from 'vitest';
import badge from './badge';
import stateStorage from './state-storage';

const mockChrome = {
    action: {
        setBadgeText: vi.fn(),
        setBadgeBackgroundColor: vi.fn(),
    },
};
vi.stubGlobal('chrome', mockChrome);

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
        newValue: [{ failedCount: 0, runningCount: 0, offlineCount: 0 }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: ' ' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'green',
    });
});

it('yellow badge when builds running', () => {
    stateStorage.onChanged.onNext({
        oldValue: [],
        newValue: [{ failedCount: 0, runningCount: 2, offlineCount: 0 }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: ' ' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'yellow',
    });
});

it('yellow badge when builds running and failed', () => {
    stateStorage.onChanged.onNext({
        oldValue: [],
        newValue: [{ failedCount: 1, runningCount: 2, offlineCount: 0 }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: '1' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'yellow',
    });
});

it('grey badge when builds offline', () => {
    stateStorage.onChanged.onNext({
        oldValue: [],
        newValue: [{ failedCount: 0, runningCount: 0, offlineCount: 2 }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: ' ' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'grey',
    });
});

it('grey badge when builds offline and failed', () => {
    stateStorage.onChanged.onNext({
        oldValue: [],
        newValue: [{ failedCount: 1, runningCount: 0, offlineCount: 2 }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: '1' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'grey',
    });
});

it('red badge when builds failed', () => {
    stateStorage.onChanged.onNext({
        oldValue: [],
        newValue: [{ failedCount: 1, runningCount: 0, offlineCount: 0 }],
    });

    expect(mockChrome.action.setBadgeText).toBeCalledWith({ text: '1' });
    expect(mockChrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({
        color: 'red',
    });
});
