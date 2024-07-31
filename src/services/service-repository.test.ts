import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import serviceRepository from './service-repository';
import { CIService, CIServiceSettings } from './service-types';

vi.mock('common/logger');

let settings: CIServiceSettings;
const mockService: CIService = {
    getLatestBuilds: vi.fn(),
    getPipelines: vi.fn(),
    getDefinition: () => ({
        typeName: 'TYPENAME',
        fields: [],
        icon: 'ICON',
        logo: 'LOGO',
        baseUrl: 'BASEURL',
        defaultConfig: {
            name: 'NAME',
            baseUrl: 'BASEURL',
            projects: ['ID1'],
        },
    }),
};
const mockPipelines = [
    { id: 'ID1', name: 'state1' },
    { id: 'ID2', name: 'state2' },
];
const mockBuilds = [
    { id: 'ID1', name: 'buildstate1' },
    { id: 'ID2', name: 'buildstate2' },
];

beforeEach(() => {
    settings = {
        name: 'NAME',
        baseUrl: 'BASEURL',
        projects: ['ID'],
    };
    serviceRepository.init([mockService]);
    vi.mocked(mockService.getPipelines).mockResolvedValue(mockPipelines);
    vi.mocked(mockService.getLatestBuilds).mockResolvedValue(mockBuilds);
});

describe('getAllDefinitions', () => {
    it('returns service definitions', () => {
        const result = serviceRepository.getAllDefinitions();

        expect(result).toEqual([mockService.getDefinition()]);
    });
});

describe('getPipelines', () => {
    it('fails when service not found', async () => {
        const invalidSettings = { ...settings, baseUrl: 'unknown' };

        await expect(() =>
            serviceRepository.getPipelines(invalidSettings),
        ).rejects.toThrow('No service found for unknown');
    });

    it('returns pipelines', async () => {
        const pipelines = await serviceRepository.getPipelines(settings);

        expect(pipelines).toEqual({
            items: mockPipelines,
            selected: settings.projects,
        });
    });

    it('sorts pipelines by name', async () => {
        const unorderedPipelines = [
            { id: 'ID2', name: 'state2' },
            { id: 'ID1', name: 'state1' },
        ];
        vi.mocked(mockService.getPipelines).mockResolvedValueOnce(unorderedPipelines);

        const pipelines = await serviceRepository.getPipelines(settings);

        expect(pipelines).toEqual({
            items: [
                { id: 'ID1', name: 'state1' },
                { id: 'ID2', name: 'state2' },
            ],
            selected: settings.projects,
        });
    });
});

describe('getBuildStates', () => {
    it('fails when service not found', async () => {
        const invalidSettings = { ...settings, baseUrl: 'unknown' };

        await expect(() =>
            serviceRepository.getLatestBuilds(invalidSettings),
        ).rejects.toThrow('No service found for unknown');
    });

    it('returns service build states', async () => {
        (mockService.getLatestBuilds as Mock).mockResolvedValue(mockBuilds);

        const state = await serviceRepository.getLatestBuilds(settings);

        expect(state).toBe(mockBuilds);
    });

    it('sorts builds by name', async () => {
        const unorderedBuilds = [
            { id: 'ID2', name: 'state2' },
            { id: 'ID1', name: 'state1' },
        ];
        vi.mocked(mockService.getLatestBuilds).mockResolvedValueOnce(unorderedBuilds);

        const pipelines = await serviceRepository.getLatestBuilds(settings);

        expect(pipelines).toEqual([
            { id: 'ID1', name: 'state1' },
            { id: 'ID2', name: 'state2' },
        ]);
    });

    it('returns error states on exception', async () => {
        settings.projects = ['ID1'];
        (mockService.getLatestBuilds as Mock).mockRejectedValueOnce(
            new Error('error message'),
        );

        const pipelines = await serviceRepository.getLatestBuilds(settings);

        expect(pipelines).toEqual([
            {
                id: 'ID1',
                name: 'ID1',
                error: {
                    name: 'Error',
                    message: 'Service update failed',
                    description: 'error message',
                },
            },
        ]);
    });
});
