import { beforeEach, expect, it, Mock, vi } from 'vitest';
import viewConfigStorage from './view-config';
import { ViewConfig } from 'common/types';
import { Storage } from './storage';

vi.mock('common/logger');
vi.mock('./storage', () => {
    const Storage = vi.fn();
    Storage.prototype.set = vi.fn();
    Storage.prototype.get = vi.fn();
    Storage.prototype.init = vi.fn();
    return { Storage };
});

let testConfigs: ViewConfig;

beforeEach(() => {
    testConfigs = {
        columns: 2,
        fullWidthGroups: true,
        singleGroupRows: false,
        showCommits: true,
        showCommitsWhenGreen: false,
        theme: 'dark',
        notifications: {
            enabled: true,
            buildBroken: true,
            buildFixed: true,
            buildStarted: false,
            buildSuccessful: false,
            buildStillFailing: false,
        },
    };
    (Storage.prototype.get as Mock).mockImplementation(() => testConfigs);
});

it('saves state to storage', async () => {
    await viewConfigStorage.set(testConfigs);

    expect(Storage.prototype.set).toBeCalledWith(testConfigs);
});

it('initilizes storage on init', () => {
    void viewConfigStorage.init();

    expect(Storage.prototype.init).toBeCalled();
});
