import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import buildkite from './buildkite';
import organizationsJson from './organizations.json';
import pipelinesJson from './pipelines.json';
import latestBuildJson from './latestBuild.json';

vi.mock('common/logger');
vi.mock('service-worker/request');

let settings: CIServiceSettings;

beforeEach(() => {
    settings = {
        name: 'mock',
        baseUrl: 'baseUrl',
        projects: [],
        url: 'https://example.com/',
        token: 'TOKEN',
        branch: 'main',
    };
});

describe('getPipelines', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock)
            .mockResolvedValueOnce({ body: organizationsJson })
            .mockResolvedValueOnce({ body: pipelinesJson });

        await buildkite.getPipelines(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'url',
                query: {
                    access_token: settings.token,
                    per_page: 100,
                },
            }),
        );
    });

    it('fails when no repos', async () => {
        (request.get as Mock)
            .mockResolvedValueOnce({ body: [] })
            .mockResolvedValueOnce({ body: [] });

        await expect(buildkite.getPipelines(settings)).rejects.toThrow(
            'No pipelines found',
        );
    });

    it('parses pipelines', async () => {
        (request.get as Mock)
            .mockResolvedValueOnce({ body: organizationsJson })
            .mockResolvedValueOnce({ body: pipelinesJson });

        const response = await buildkite.getPipelines(settings);

        expect(response).toHaveLength(2);
        expect(response).toEqual([
            {
                id: 'org/slug1',
                name: 'pipeline1',
                group: 'org_name',
            },
            {
                id: 'org/slug2',
                name: 'pipeline2',
                group: 'org_name',
            },
        ]);
    });
});

describe('getLatestBuilds', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValueOnce({ body: latestBuildJson });
        settings.projects = ['org/repo'];

        await buildkite.getLatestBuilds(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api.buildkite.com/v2/organizations/org/pipelines/repo/builds',
                query: {
                    access_token: settings.token,
                    per_page: 1,
                    branch: settings.branch,
                },
            }),
        );
    });

    it('parses build', async () => {
        settings.projects = ['org/repo1'];
        (request.get as Mock).mockResolvedValueOnce({ body: latestBuildJson });

        const response = await buildkite.getLatestBuilds(settings);

        expect(response).toEqual([
            {
                changes: [{ name: 'creator name', message: 'message' }],
                group: 'org',
                id: 'org/repo1',
                isBroken: false,
                isRunning: false,
                isWaiting: false,
                name: 'repo1',
                tags: [],
                webUrl: 'https://buildkite.com/org/pipeline1/builds/15',
            },
        ]);
    });

    it('parses broken build', async () => {
        settings.projects = ['org/repo1'];
        (request.get as Mock).mockResolvedValueOnce({
            body: [{ ...latestBuildJson[0], state: 'failed' }],
        });

        const response = await buildkite.getLatestBuilds(settings);

        expect(response).toEqual([
            expect.objectContaining({
                isBroken: true,
            }),
        ]);
    });

    it('parses running build', async () => {
        settings.projects = ['org/repo1'];
        (request.get as Mock)
            .mockResolvedValueOnce({
                body: [{ ...latestBuildJson[0], state: 'running' }],
            })
            .mockResolvedValueOnce({ body: latestBuildJson });

        const response = await buildkite.getLatestBuilds(settings);

        expect(response).toEqual([
            expect.objectContaining({
                isRunning: true,
            }),
        ]);
    });

    it('parses waiting build', async () => {
        settings.projects = ['org/repo1'];
        (request.get as Mock)
            .mockResolvedValueOnce({
                body: [{ ...latestBuildJson[0], state: 'scheduled' }],
            })
            .mockResolvedValueOnce({ body: latestBuildJson });

        const response = await buildkite.getLatestBuilds(settings);

        expect(response).toEqual([
            expect.objectContaining({
                isWaiting: true,
            }),
        ]);
    });

    it('parses canceled build', async () => {
        settings.projects = ['org/repo1'];
        (request.get as Mock)
            .mockResolvedValueOnce({
                body: [{ ...latestBuildJson[0], state: 'canceled' }],
            })
            .mockResolvedValueOnce({ body: latestBuildJson });

        const response = await buildkite.getLatestBuilds(settings);

        expect(response).toEqual([
            expect.objectContaining({
                tags: [{ name: 'Canceled', type: 'warning' }],
            }),
        ]);
    });

    it('parses canceling build', async () => {
        settings.projects = ['org/repo1'];
        (request.get as Mock)
            .mockResolvedValueOnce({
                body: [{ ...latestBuildJson[0], state: 'canceling' }],
            })
            .mockResolvedValueOnce({ body: latestBuildJson });

        const response = await buildkite.getLatestBuilds(settings);

        expect(response).toEqual([
            expect.objectContaining({
                tags: [{ name: 'Canceled', type: 'warning' }],
            }),
        ]);
    });

    it('parses not_run build', async () => {
        settings.projects = ['org/repo1'];
        (request.get as Mock).mockResolvedValueOnce({
            body: [{ ...latestBuildJson[0], state: 'not_run' }],
        });

        const response = await buildkite.getLatestBuilds(settings);

        expect(response).toEqual([
            expect.objectContaining({
                tags: [{ name: 'Not built', type: 'warning' }],
            }),
        ]);
    });
});
