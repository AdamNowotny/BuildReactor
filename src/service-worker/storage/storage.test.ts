import { beforeEach, expect, it, vi } from 'vitest';
import { Storage } from './storage';

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

let storageInstance: Storage<object>;

beforeEach(() => {
    storageInstance = new Storage<object>({
        key: 'key',
        defaultValue: [],
    });
});

it('saves state to storage', async () => {
    await storageInstance.set({ value: 5 });

    expect(mockChrome.storage.local.set).toBeCalledWith({ key: { value: 5 } });
});

it('reads state on init', () => {
    mockChrome.storage.local.get.mockReturnValue({ value: 5 });

    void storageInstance.init();

    expect(mockChrome.storage.local.get).toBeCalled();
});

it('gets item once initialized', async () => {
    mockChrome.storage.local.get.mockImplementation((_, callback) => {
        callback({ key: { columns: 10 } });
    });

    await storageInstance.init();
    const config = await storageInstance.get();

    expect(config).toMatchObject({ columns: 10 });
    expect(mockChrome.storage.local.get).toBeCalled();
});

it('gets default config if storage undefined', async () => {
    storageInstance = new Storage<object>({
        key: 'key',
        defaultValue: { value: 'default' },
    });
    mockChrome.storage.local.get.mockImplementation((_, callback) => {
        callback({ key: undefined });
    });

    await storageInstance.init();
    const config = await storageInstance.get();

    expect(config).toMatchObject({ value: 'default' });
    expect(mockChrome.storage.local.get).toBeCalled();
});

it('gets default config for empty array', async () => {
    storageInstance = new Storage<object>({
        key: 'key',
        defaultValue: [],
    });
    mockChrome.storage.local.get.mockImplementation((_, callback) => {
        callback({ key: undefined });
    });

    await storageInstance.init();
    const config = await storageInstance.get();

    expect(config).toMatchObject([]);
    expect(mockChrome.storage.local.get).toBeCalled();
});

it('publishes onChanged event', () => {
    void storageInstance.init();
    const handler = mockChrome.storage.onChanged.addListener.mock.lastCall?.at(0);

    const expectedOldValue = { columns: null };
    const expectedNewValue = { columns: 5 };
    const changedEvent = {
        configuration: {
            oldValue: expectedOldValue,
            newValue: expectedNewValue,
        },
    };

    handler(changedEvent, 'local');

    storageInstance.onChanged.subscribe(({ oldValue, newValue }) => {
        expect(oldValue).toStrictEqual(expectedOldValue);
        expect(newValue).toStrictEqual(expectedNewValue);
    });
});

it('publishes onChanged only if key changed', () => {
    void storageInstance.init();
    const handler = mockChrome.storage.onChanged.addListener.mock.lastCall?.at(0);

    const changedEvent = {
        services: {
            oldValue: { columns: null },
            newValue: { columns: 5 },
        },
    };

    handler(changedEvent, 'local');

    storageInstance.onChanged.subscribe(({ oldValue, newValue }) => {
        expect(oldValue).not.toBe({ columns: null });
        expect(newValue).not.toBe({ columns: 5 });
    });
});
