import { expect, it, vi } from 'vitest';
import viewConfigStorage from './view-config-storage';

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
vi.mock('common/logger');

it('saves state to storage', async () => {
    await viewConfigStorage.set({ columns: 5 });

    expect(mockChrome.storage.local.set).toBeCalledWith({ configuration: { columns: 5 } });
});

it('reads state on init', () => {
    mockChrome.storage.local.get.mockReturnValue({ columns: 5 });

    void viewConfigStorage.init();

    expect(mockChrome.storage.local.get).toBeCalled();
});

it('gets item once initialized', async () => {
    mockChrome.storage.local.get.mockImplementation((_, callback) => {
        callback({ configuration: { columns: 10 } });
    });

    await viewConfigStorage.init();
    const config = await viewConfigStorage.get();

    expect(config).toMatchObject({ columns: 10 });
    expect(mockChrome.storage.local.get).toBeCalled();
});

it('gets default config if storage undefined', async () => {
    mockChrome.storage.local.get.mockImplementation((_, callback) => {
        callback({ configuration: undefined });
    });

    await viewConfigStorage.init();
    const config = await viewConfigStorage.get();

    expect(config).toMatchObject({ columns: 2, theme: 'dark' });
    expect(mockChrome.storage.local.get).toBeCalled();
});

it('publishes onChanged event', () => {
    void viewConfigStorage.init();
    const [handler] = mockChrome.storage.onChanged.addListener.mock.lastCall;

    const expectedOldValue = { columns: null };
    const expectedNewValue = { columns: 5 };
    const changedEvent = {
        configuration: {
            oldValue: expectedOldValue,
            newValue: expectedNewValue,
        },
    };

    handler(changedEvent, 'local');

    viewConfigStorage.onChanged.subscribe(({ oldValue, newValue }) => {
        expect(oldValue).toStrictEqual(expectedOldValue);
        expect(newValue).toStrictEqual(expectedNewValue);
    });
});

it('publishes onChanged only for configuration', () => {
    void viewConfigStorage.init();
    const [handler] = mockChrome.storage.onChanged.addListener.mock.lastCall;

    const changedEvent = {
        services: {
            oldValue: { columns: null },
            newValue: { columns: 5 },
        },
    };

    handler(changedEvent, 'local');

    viewConfigStorage.onChanged.subscribe(({ oldValue, newValue }) => {
        expect(oldValue).not.toBe({ columns: null });
        expect(newValue).not.toBe({ columns: 5 });
    });
});
