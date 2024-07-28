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
        projects: [],
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
                query: expect.objectContaining({
                    os_authType: 'guest',
                }),
            }),
        );
    });

    it('passes auth to request', async () => {
        (request.get as Mock).mockResolvedValue({
            body: projectsJson,
        });
        settings.username = 'username';
        settings.password = 'password';

        await bamboo.getPipelines(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                query: expect.objectContaining({
                    os_authType: 'basic',
                }),
                username: 'username',
                password: 'password',
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

describe('getBuildStates', () => {
    it('passes parameters to plan and request', async () => {
        (request.get as Mock).mockResolvedValueOnce({ body: resultJson });
        settings.projects = ['AD-BAOIS'];

        await bamboo.getBuildStates(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://example.com/rest/api/latest/result/AD-BAOIS/latest.json',
                query: expect.objectContaining({
                    os_authType: 'guest',
                }),
                type: 'json',
            }),
        );
    });

    it('passes auth to plan and request', async () => {
        (request.get as Mock).mockResolvedValueOnce({ body: resultJson });
        settings.projects = ['AD-BAOIS'];
        settings.username = 'USERNAME';
        settings.password = 'PASSWORD';

        await bamboo.getBuildStates(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                query: expect.objectContaining({
                    os_authType: 'basic',
                }),
                username: 'USERNAME',
                password: 'PASSWORD',
            }),
        );
    });

    it('parses builds', async () => {
        (request.get as Mock).mockResolvedValueOnce({ body: resultJson });
        settings.projects = ['ATLAS-ATL'];

        const response = await bamboo.getBuildStates(settings);

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
        settings.projects = ['ATLAS-ATL'];

        const response = await bamboo.getBuildStates(settings);

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
        settings.projects = ['ATLAS-ATL'];

        const response = await bamboo.getBuildStates(settings);

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
        settings.projects = ['ATLAS-ATL'];

        const response = await bamboo.getBuildStates(settings);

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
