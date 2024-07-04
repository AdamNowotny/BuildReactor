import { expect, it, vi } from 'vitest';
import stateStorage from './state-storage';

const mockChrome = {
    storage: {
        local: {
            get: vi.fn(),
            set: vi.fn(),
        },
        onChanged: {
            addListener: vi.fn(),
        },
    },
};
vi.stubGlobal('chrome', mockChrome);

it('saves state to storage', async () => {
    await stateStorage.set({ a: 5 });

    expect(mockChrome.storage.local.set).toBeCalledWith({ state: { a: 5 } });
});

it('reads state on init', () => {
    mockChrome.storage.local.get.mockReturnValue({ a: 5 });

    stateStorage.init();

    expect(mockChrome.storage.local.get).toBeCalled();
});

it('publishes onChanged event', () => {
    stateStorage.init();
    const [ handler ] = mockChrome.storage.onChanged.addListener.mock.lastCall;

    const expectedOldValue = { a: null };
    const expectedNewValue = { a: 5 };
    const changedEvent = {
        state: {
            oldValue: expectedOldValue,
            newValue: expectedNewValue
        },
    };

    handler(changedEvent, 'local');

    stateStorage.onChanged.subscribe(({ oldValue, newValue }) => {
        expect(oldValue).toStrictEqual(expectedOldValue);
        expect(newValue).toStrictEqual(expectedNewValue);
    });
});

it('publishes onChanged only for state', () => {
    stateStorage.init();
    const [ handler ] = mockChrome.storage.onChanged.addListener.mock.lastCall;

    const changedEvent = {
        config: {
            oldValue: { a: null },
            newValue: { a: 5 }
        },
    };

    handler(changedEvent, 'local');

    stateStorage.onChanged.subscribe(({ oldValue, newValue }) => {
        expect(oldValue).not.toBe({ a: null });
        expect(newValue).not.toBe({ a: 5 });
    });
});
