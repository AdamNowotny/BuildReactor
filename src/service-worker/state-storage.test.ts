import { expect, it, vi } from 'vitest';
import stateStorage from './state-storage';

const mockChrome = {
    storage: {
        local: {
            set: vi.fn(),
        },
        onChanged: {
            addListener: vi.fn(),
        },
    },
};
vi.stubGlobal('chrome', mockChrome);

it('saves state to storage', async () => {
    const spy = vi.spyOn(chrome.storage.local, 'set');

    await stateStorage.set({ a: 5 });

    expect(spy).toHaveBeenCalledWith({ state: { a: 5 } });
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
