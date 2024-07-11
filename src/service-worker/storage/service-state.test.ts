import { CIBuild } from 'services/service-types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import stateStorage, { ServiceStateItem } from './service-state';
import { Storage } from './storage';

vi.mock('common/logger');
vi.mock('./storage', () => {
    const Storage = vi.fn();
    Storage.prototype.set = vi.fn();
    Storage.prototype.get = vi.fn();
    Storage.prototype.init = vi.fn();
    return { Storage };
});

let testState: ServiceStateItem[];

beforeEach(() => {
    testState = [
        {
            failedCount: 0,
            offlineCount: 0,
            runningCount: 0,
            name: 'service 1',
            items: [{ id: 'build1', name: 'Build 1', group: null }],
        },
        {
            failedCount: 0,
            offlineCount: 0,
            runningCount: 0,
            name: 'service 2',
            items: [{ id: 'build2', name: 'Build 2', group: null }],
        },
    ];
    (Storage.prototype.get as Mock).mockImplementation(() => testState);
});

describe('set', () => {
    it('saves state to storage', async () => {
        await stateStorage.set(testState);

        expect(Storage.prototype.set).toBeCalledWith(testState);
    });
});

describe('init', () => {
    it('initilizes storage on init', () => {
        void stateStorage.init();

        expect(Storage.prototype.init).toBeCalled();
    });
});

it('cleans up state on configuration change', async () => {
    await stateStorage.reset(['service 2']);

    expect(Storage.prototype.set).toBeCalledWith<ServiceStateItem[][]>([
        {
            name: 'service 2',
            items: testState[1].items,
            failedCount: 0,
            offlineCount: 0,
            runningCount: 0,
        },
    ]);
});

describe.skip('updateService', () => {
    it('adds new service to state', async () => {
        const items: CIBuild[] = [{ id: 'build1', name: 'Build 1', group: null }];
        (Storage.prototype.get as Mock).mockImplementation(() => []);

        await stateStorage.updateService('name', items);

        expect(Storage.prototype.set).toBeCalledWith<ServiceStateItem[][]>([
            { name: 'name', items, failedCount: 0, offlineCount: 0, runningCount: 0 },
        ]);
    });

    it('updates existing service', async () => {
        const items: CIBuild[] = [{ id: 'build1', name: 'Build 1', group: null }];
        (Storage.prototype.get as Mock).mockImplementation(() => [
            {
                name: 'name1',
                items,
                failedCount: 0,
                offlineCount: 0,
                runningCount: 0,
            },
        ]);

        await stateStorage.updateService('name2', items);

        expect(Storage.prototype.set).toBeCalledWith<ServiceStateItem[][]>([
            { name: 'name1', items, failedCount: 0, offlineCount: 0, runningCount: 0 },
            { name: 'name2', items, failedCount: 0, offlineCount: 0, runningCount: 0 },
        ]);
    });

    it('calculates failedCount', async () => {
        const items: CIBuild[] = [
            { id: 'build1', name: 'Build 1', group: null, isBroken: true },
            { id: 'build2', name: 'Build 2', group: null, isBroken: true, isDisabled: true },
        ];

        await stateStorage.updateService('name', items);

        expect(Storage.prototype.set).toBeCalledWith(
            expect.arrayContaining([expect.objectContaining({ failedCount: 1 })])
        );
    });

    it('calculates runningCount', async () => {
        const items: CIBuild[] = [
            { id: 'build1', name: 'Build 1', group: null, isRunning: true },
            { id: 'build2', name: 'Build 2', group: null, isRunning: true, isDisabled: true },
        ];

        await stateStorage.updateService('name', items);

        expect(Storage.prototype.set).toBeCalledWith(
            expect.arrayContaining([expect.objectContaining({ runningCount: 1 })])
        );
    });

    it('calculates offlineCount', async () => {
        const items: CIBuild[] = [
            {
                id: 'build1',
                name: 'Build 1',
                group: null,
                isDisabled: false,
                error: { name: 'Error', message: 'error1' },
            },
            {
                id: 'build2',
                name: 'Build 2',
                group: null,
                isDisabled: true,
                error: { name: 'Error', message: 'error2' },
            },
        ];

        await stateStorage.updateService('name', items);

        expect(Storage.prototype.set).toBeCalledWith(
            expect.arrayContaining([expect.objectContaining({ offlineCount: 1 })])
        );
    });
});
