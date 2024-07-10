import { beforeEach, expect, it, Mock, vi } from 'vitest';
import stateStorage, { StateStorageItem } from './service-state';
import { Storage } from './storage';

vi.mock('common/logger');
vi.mock('./storage', () => {
    const Storage = vi.fn();
    Storage.prototype.set = vi.fn();
    Storage.prototype.get = vi.fn();
    Storage.prototype.init = vi.fn();
    return { Storage };
});

let testState: StateStorageItem[];

beforeEach(() => {
    testState = [{
        failedCount: 0,
        offlineCount: 0,
        runningCount: 0,
        name: 'test',
        items: [{ name: 'Build 1', group: null, id: 'build1' }],
    }];
    (Storage.prototype.get as Mock).mockImplementation(() => testState);
});

it('saves state to storage', async () => {
    await stateStorage.set(testState);

    expect(Storage.prototype.set).toBeCalledWith(testState);
});

it('initilizes storage on init', () => {
    void stateStorage.init();

    expect(Storage.prototype.init).toBeCalled();
});
