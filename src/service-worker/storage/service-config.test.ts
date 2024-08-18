import { CIServiceSettings } from 'common/types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import serviceConfig from './service-config';
import { Storage } from './storage';

vi.mock('common/logger');
vi.mock('./storage', () => {
    const Storage = vi.fn();
    Storage.prototype.set = vi.fn();
    Storage.prototype.get = vi.fn();
    Storage.prototype.init = vi.fn();
    return { Storage };
});

let testConfigs: CIServiceSettings[];
const ENABLED_SERVICE = 0;
const DISABLED_SERVICE = 1;

beforeEach(() => {
    testConfigs = [
        {
            baseUrl: 'test1',
            name: 'test1',
            pipelines: [],
            isDisabled: false,
        },
        {
            baseUrl: 'test2',
            name: 'test2',
            pipelines: [],
            isDisabled: true,
        },
    ];
    (Storage.prototype.get as Mock).mockImplementation(() => testConfigs);
});

it('saves config to storage', async () => {
    await serviceConfig.set(testConfigs);

    expect(Storage.prototype.set).toBeCalledWith(testConfigs);
});

it('initilizes storage on init', () => {
    void serviceConfig.init();

    expect(Storage.prototype.init).toBeCalled();
});

describe('enableService', () => {
    it('should fail if service not found', async () => {
        (Storage.prototype.get as Mock).mockImplementation(() => []);

        await expect(async () => {
            await serviceConfig.enableService(testConfigs[DISABLED_SERVICE].name);
        }).rejects.toThrow('Service test2 not found');
    });

    it('should enable service', async () => {
        await serviceConfig.enableService(testConfigs[DISABLED_SERVICE].name);

        expect(Storage.prototype.set).toBeCalledWith([
            { ...testConfigs[0], isDisabled: false },
            { ...testConfigs[1], isDisabled: false },
        ]);
    });
});

describe('disableService', () => {
    it('should fail if service not found', async () => {
        (Storage.prototype.get as Mock).mockImplementation(() => []);

        await expect(async () => {
            await serviceConfig.disableService(testConfigs[ENABLED_SERVICE].name);
        }).rejects.toThrow('Service test1 not found');
    });

    it('should disable service', async () => {
        await serviceConfig.disableService(testConfigs[ENABLED_SERVICE].name);

        expect(Storage.prototype.set).toBeCalledWith([
            { ...testConfigs[0], isDisabled: true },
            { ...testConfigs[1], isDisabled: true },
        ]);
    });
});

describe('removeService', () => {
    it('should remove item', async () => {
        await serviceConfig.removeService(testConfigs[ENABLED_SERVICE].name);

        expect(Storage.prototype.set).toBeCalledWith([testConfigs[DISABLED_SERVICE]]);
    });
});

describe('renameService', () => {
    it('should rename item', async () => {
        await serviceConfig.renameService(testConfigs[ENABLED_SERVICE].name, 'new name');

        expect(Storage.prototype.set).toBeCalledWith([
            { ...testConfigs[ENABLED_SERVICE], name: 'new name' },
            testConfigs[DISABLED_SERVICE],
        ]);
    });
});

describe('saveService', () => {
    it('should save new item', async () => {
        const newItem = { ...testConfigs[ENABLED_SERVICE], name: 'new', token: 'token' };

        await serviceConfig.saveService(newItem);

        expect(Storage.prototype.set).toBeCalledWith([
            testConfigs[0],
            testConfigs[1],
            newItem,
        ]);
    });

    it('should save existing item', async () => {
        const item = { ...testConfigs[ENABLED_SERVICE], token: 'token' };

        await serviceConfig.saveService(item);

        expect(Storage.prototype.set).toBeCalledWith([
            item,
            testConfigs[DISABLED_SERVICE],
        ]);
    });
});

describe('setOrder', () => {
    it('should fail if services not found', async () => {
        const result = serviceConfig.setOrder(['unknown']);

        await expect(result).rejects.toThrow('Service unknown not found');
        expect(Storage.prototype.set).not.toBeCalled();
    });

    it('should reorder items', async () => {
        await serviceConfig.setOrder([testConfigs[1].name, testConfigs[0].name]);

        expect(Storage.prototype.set).toBeCalledWith([testConfigs[1], testConfigs[0]]);
    });
});

describe('setBuildOrder', () => {
    it('should fail if services not found', async () => {
        const result = serviceConfig.setBuildOrder('unknown', ['build1', 'build2']);

        await expect(result).rejects.toThrow('Service unknown not found');
        expect(Storage.prototype.set).not.toBeCalled();
    });

    it('should reorder builds', async () => {
        await serviceConfig.setBuildOrder(testConfigs[ENABLED_SERVICE].name, [
            'build1',
            'build2',
        ]);

        expect(Storage.prototype.set).toBeCalledWith([
            { ...testConfigs[ENABLED_SERVICE], pipelines: ['build1', 'build2'] },
            testConfigs[DISABLED_SERVICE],
        ]);
    });
});
