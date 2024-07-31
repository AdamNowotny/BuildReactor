import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import buildbot from './buildbot';
import buildersJson from './builders.json';
import lastBuildJson from './builds_complete.json';

vi.mock('common/logger');
vi.mock('service-worker/request');

let settings: CIServiceSettings;

beforeEach(() => {
    settings = {
        name: 'mock',
        baseUrl: 'baseUrl',
        projects: [],
        username: 'USERNAME',
        password: 'PASSWORD',
        url: 'https://example.com/',
    };
});

describe('getPipelines', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValue({ body: buildersJson });

        await buildbot.getPipelines(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://example.com/api/v2/builders',
                username: 'USERNAME',
                password: 'PASSWORD',
                type: 'json',
            }),
        );
    });

    it('parses builders', async () => {
        (request.get as Mock).mockResolvedValue({ body: buildersJson });

        const response = await buildbot.getPipelines(settings);

        expect(response).toHaveLength(207);
        expect(response).toEqual(
            expect.arrayContaining([
                {
                    id: 'Apple-Sonoma-Smart-Pointer-Static-Analyzer-Build',
                    name: 'Apple-Sonoma-Smart-Pointer-Static-Analyzer-Build',
                },
                {
                    id: 'Apple-iOS-14-Simulator-Debug-Build',
                    name: 'Apple-iOS-14-Simulator-Debug-Build',
                },
            ]),
        );
    });
});

describe('getLatestBuilds', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValue({ body: lastBuildJson });
        settings.projects = ['Apple-iOS-14-Simulator-Debug-Build'];

        await buildbot.getLatestBuilds(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://example.com/api/v2/builders/Apple-iOS-14-Simulator-Debug-Build/builds',
                username: settings.username,
                password: settings.password,
                type: 'json',
                query: {
                    limit: 1,
                    order: '-number',
                },
            }),
        );
    });

    it('parses builds', async () => {
        (request.get as Mock).mockResolvedValue({ body: lastBuildJson });
        settings.projects = ['Apple-iOS-14-Simulator-Debug-Build'];

        const response = await buildbot.getLatestBuilds(settings);

        expect(response).toEqual([
            {
                id: 'Apple-iOS-14-Simulator-Debug-Build',
                isBroken: true,
                isRunning: false,
                name: 'Apple-iOS-14-Simulator-Debug-Build',
                webUrl: 'https://example.com/#/builders/Apple-iOS-14-Simulator-Debug-Build/builds/16837',
            },
        ]);
    });
});
