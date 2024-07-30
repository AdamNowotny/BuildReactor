import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import buildsJson from './builds.json';
import buildsFailedJson from './builds_failed.json';
import buildsRunningJson from './builds_running.json';
import reposJson from './repos.json';
import travis from './travis';

vi.mock('common/logger');
vi.mock('service-worker/request');

let settings: CIServiceSettings;

beforeEach(() => {
    settings = {
        name: 'mock',
        baseUrl: 'baseUrl',
        projects: [],
        token: 'TOKEN',
        apiUrl: 'https://api.travis-ci.org/',
        webUrl: 'https://travis-ci.org/',
    };
});

describe('getPipelines', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValue({ body: reposJson });

        await travis.getPipelines(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api.travis-ci.org/repos',
                headers: {
                    'Travis-API-Version': '3',
                    Authorization: `token ${settings.token}`,
                },
            }),
        );
    });

    it('return empty array when no repos', async () => {
        (request.get as Mock).mockResolvedValue({ body: {} });

        const response = await travis.getPipelines(settings);

        expect(response).toEqual([]);
    });

    it('parses repos', async () => {
        (request.get as Mock).mockResolvedValue({ body: reposJson });

        const response = await travis.getPipelines(settings);

        expect(response).toHaveLength(2);
        expect(response).toEqual([
            {
                id: 'AdamNowotny/BuildReactor',
                name: 'BuildReactor',
                group: 'AdamNowotny',
                isDisabled: false,
            },
            {
                id: 'AdamNowotny/toxicity-charts',
                name: 'toxicity-charts',
                group: 'AdamNowotny',
                isDisabled: false,
            },
        ]);
    });
});

describe('getBuildStates', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValue({ body: buildsJson });
        settings.projects = ['org/repo'];

        await travis.getBuildStates(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api.travis-ci.org/repo/org%2Frepo/builds',
                query: {
                    limit: 1,
                    include: 'build.commit',
                    'build.event_type': 'push',
                },
                headers: {
                    'Travis-API-Version': '3',
                    Authorization: `token ${settings.token}`,
                },
            }),
        );
    });

    it('parses build', async () => {
        settings.projects = ['org/repo1'];
        (request.get as Mock).mockResolvedValue({ body: buildsJson });

        const response = await travis.getBuildStates(settings);

        expect(response).toEqual([
            {
                changes: [
                    {
                        name: 'author name',
                        message: undefined,
                    },
                ],
                id: 'org/repo1',
                name: 'repo1',
                group: 'org',
                isBroken: false,
                isRunning: false,
                isWaiting: false,
                tags: [],
                webUrl: 'https://travis-ci.org/org/repo1/builds/12345',
            },
        ]);
    });

    it('parses failed build', async () => {
        settings.projects = ['org/repo1'];
        (request.get as Mock).mockResolvedValue({ body: buildsFailedJson });

        const response = await travis.getBuildStates(settings);

        expect(response).toEqual([
            expect.objectContaining({
                isBroken: true,
            }),
        ]);
    });

    it('parses running build', async () => {
        settings.projects = ['org/repo1'];
        (request.get as Mock).mockResolvedValue({ body: buildsRunningJson });

        const response = await travis.getBuildStates(settings);

        expect(response).toEqual([
            expect.objectContaining({
                isBroken: true,
                isRunning: true,
            }),
        ]);
    });
});
