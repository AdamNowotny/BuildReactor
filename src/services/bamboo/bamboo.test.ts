import request from 'service-worker/request';
import { CIBuildChange, CIServiceSettings } from 'services/service-types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import bamboo from './bamboo';
import projectsJson from './projects.json';
import resultJson from './result.json';

vi.mock('common/logger');
vi.mock('service-worker/request');

let settings: CIServiceSettings;

beforeEach(() => {
    settings = {
        name: 'mock',
        baseUrl: 'baseUrl',
        pipelines: [],
        token: 'mockToken',
        url: 'https://example.com/',
    };
});

describe('getPipelines', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValue({
            body: projectsJson,
        });

        await bamboo.getPipelines(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://example.com/rest/api/latest/project.json',
                headers: {
                    Authorization: `Bearer ${settings.token}`,
                },
            }),
        );
    });

    it('passes os_authType to request when guest', async () => {
        (request.get as Mock).mockResolvedValue({
            body: projectsJson,
        });
        settings.token = undefined;

        await bamboo.getPipelines(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://example.com/rest/api/latest/project.json',
                query: expect.objectContaining({ os_authType: 'guest' }),
            }),
        );
    });

    it('parses plans', async () => {
        (request.get as Mock).mockResolvedValue({
            body: projectsJson,
        });

        const response = await bamboo.getPipelines(settings);

        expect(response).toHaveLength(180);
        expect(response).toEqual(
            expect.arrayContaining([
                {
                    id: 'AD-BAOIS',
                    isDisabled: false,
                    group: 'Add-Ons',
                    name: 'Build Add On Index Server',
                },
                {
                    id: 'ATLAS-BADI',
                    isDisabled: true,
                    group: 'Atlas',
                    name: 'Atlas Server 2.1',
                },
            ]),
        );
    });
});

describe('getLatestBuilds', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValueOnce({ body: resultJson });
        settings.pipelines = ['AD-BAOIS'];

        await bamboo.getLatestBuilds(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://example.com/rest/api/latest/result/AD-BAOIS/latest.json',
                type: 'json',
                headers: {
                    Authorization: `Bearer ${settings.token}`,
                },
            }),
        );
    });

    it('passes os_authType to request when guest', async () => {
        (request.get as Mock).mockResolvedValueOnce({ body: resultJson });
        settings.pipelines = ['AD-BAOIS'];
        settings.token = undefined;

        await bamboo.getLatestBuilds(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://example.com/rest/api/latest/result/AD-BAOIS/latest.json',
                type: 'json',
                query: expect.objectContaining({ os_authType: 'guest' }),
            }),
        );
    });

    it('parses builds', async () => {
        (request.get as Mock).mockResolvedValueOnce({ body: resultJson });
        settings.pipelines = ['ATLAS-ATL'];

        const response = await bamboo.getLatestBuilds(settings);

        expect(response).toEqual([
            {
                changes: [
                    {
                        name: 'Burke Mamlin <burke@openmrs.org>',
                        message: 'Update node and libraries',
                    },
                ] as CIBuildChange[],
                id: 'ATLAS-ATL',
                group: 'Atlas',
                isBroken: false,
                isRunning: false,
                isWaiting: false,
                isDisabled: false,
                name: 'Atlas Server',
                webUrl: 'https://example.com/browse/ATLAS-ATL-117',
            },
        ]);
    });

    it('parses broken build', async () => {
        (request.get as Mock).mockResolvedValueOnce({
            body: { ...resultJson, state: 'Failed' },
        });
        settings.pipelines = ['ATLAS-ATL'];

        const response = await bamboo.getLatestBuilds(settings);

        expect(response).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 'ATLAS-ATL',
                    group: 'Atlas',
                    isBroken: true,
                }),
            ]),
        );
    });

    it('parses running build', async () => {
        (request.get as Mock).mockResolvedValueOnce({
            body: { ...resultJson, ...{ plan: { isBuilding: true } } },
        });
        settings.pipelines = ['ATLAS-ATL'];

        const response = await bamboo.getLatestBuilds(settings);

        expect(response).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 'ATLAS-ATL',
                    isRunning: true,
                }),
            ]),
        );
    });

    it('parses waiting build', async () => {
        (request.get as Mock).mockResolvedValueOnce({
            body: { ...resultJson, ...{ plan: { isActive: true } } },
        });
        settings.pipelines = ['ATLAS-ATL'];

        const response = await bamboo.getLatestBuilds(settings);

        expect(response).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 'ATLAS-ATL',
                    isWaiting: true,
                }),
            ]),
        );
    });
});
