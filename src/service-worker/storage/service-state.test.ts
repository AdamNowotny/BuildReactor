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
            items: [{ id: 'build1', name: 'Build 1' }],
        },
        {
            failedCount: 0,
            offlineCount: 0,
            runningCount: 0,
            name: 'service 2',
            items: [{ id: 'build2', name: 'Build 2' }],
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

describe('updateService', () => {
    it('adds new service to state', async () => {
        const items: CIBuild[] = [{ id: 'build1', name: 'Build 1' }];
        (Storage.prototype.get as Mock).mockImplementation(() => []);

        await stateStorage.updateService('name', items);

        expect(Storage.prototype.set).toBeCalledWith<ServiceStateItem[][]>([
            { name: 'name', items, failedCount: 0, offlineCount: 0, runningCount: 0 },
        ]);
    });

    it('updates existing service', async () => {
        const items: CIBuild[] = [{ id: 'build1', name: 'Build 1' }];
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
            { id: 'build1', name: 'Build 1', isBroken: true },
            { id: 'build2', name: 'Build 2', isBroken: true, isDisabled: true },
        ];

        await stateStorage.updateService('name', items);

        expect(Storage.prototype.set).toBeCalledWith(
            expect.arrayContaining([expect.objectContaining({ failedCount: 1 })]),
        );
    });

    it('calculates runningCount', async () => {
        const items: CIBuild[] = [
            { id: 'build1', name: 'Build 1', isRunning: true },
            { id: 'build2', name: 'Build 2', isRunning: true, isDisabled: true },
        ];

        await stateStorage.updateService('name', items);

        expect(Storage.prototype.set).toBeCalledWith(
            expect.arrayContaining([expect.objectContaining({ runningCount: 1 })]),
        );
    });

    it('calculates offlineCount', async () => {
        const items: CIBuild[] = [
            {
                id: 'build1',
                name: 'Build 1',
                isDisabled: false,
                error: { name: 'Error', message: 'error1' },
            },
            {
                id: 'build2',
                name: 'Build 2',
                isDisabled: true,
                error: { name: 'Error', message: 'error2' },
            },
        ];

        await stateStorage.updateService('service 1', items);

        expect(Storage.prototype.set).toBeCalledWith(
            expect.arrayContaining([expect.objectContaining({ offlineCount: 1 })]),
        );
    });

    it('uses previous state if error present', async () => {
        testState = [
            {
                name: 'service',
                items: [
                    {
                        id: 'build1',
                        name: 'Build 1',
                        isRunning: true,
                        isBroken: true,
                    },
                ],
            },
        ];
        (Storage.prototype.get as Mock).mockImplementation(() => testState);

        const items: CIBuild[] = [
            {
                id: 'build1',
                name: 'Build 1',
                error: { name: 'Error', message: 'error1' },
            },
        ];

        await stateStorage.updateService('service', items);

        expect(Storage.prototype.set).toBeCalledWith([
            expect.objectContaining({
                items: [
                    expect.objectContaining({
                        id: 'build1',
                        isRunning: true,
                        isBroken: true,
                    }),
                ],
            }),
        ]);
    });

    it('returns error state when no previous state exists', async () => {
        (Storage.prototype.get as Mock).mockImplementation(() => []);

        const items: CIBuild[] = [
            {
                id: 'build1',
                name: 'Build 1',
                error: { name: 'Error', message: 'error1' },
            },
        ];

        await stateStorage.updateService('service', items);

        expect(Storage.prototype.set).toBeCalledWith([
            expect.objectContaining({
                items: [
                    expect.objectContaining({
                        id: 'build1',
                        error: { name: 'Error', message: 'error1' },
                    }),
                ],
            }),
        ]);
    });
});
