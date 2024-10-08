import request from 'service-worker/request';
import { CIBuildChange, CIServiceSettings } from 'common/types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import github from './github';
import workflowJson from './workflows.json';
import workflowRunsJson from './workflowruns.json';
import workflowRunsErrorJson from './workflowruns_error.json';

vi.mock('common/logger');
vi.mock('service-worker/request');

let settings: CIServiceSettings;

beforeEach(() => {
    settings = {
        name: 'mock',
        baseUrl: 'baseUrl',
        pipelines: [],
        token: 'mockToken',
        url: 'https://github.com/OWNER/REPO',
    };
});

describe('getPipelines', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValue({
            body: { workflows: [] },
        });

        await github.getPipelines(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api.github.com/repos/OWNER/REPO/actions/workflows',
                headers: expect.objectContaining({
                    Authorization: 'Bearer mockToken',
                    'X-GitHub-Api-Version': '2022-11-28',
                    Accept: 'application/vnd.github.v3+json',
                }),
            }),
        );
    });

    it('parses workflows', async () => {
        (request.get as Mock).mockResolvedValue({
            body: workflowJson,
        });

        const response = await github.getPipelines(settings);

        expect(response).toEqual([
            {
                id: '108648178 | .github/workflows/build.yml',
                isDisabled: false,
                name: '.github/workflows/build.yml',
            },
            {
                id: '108658767 | .github/workflows/main.yml',
                isDisabled: false,
                name: '.github/workflows/main.yml',
            },
            {
                id: '108658230 | .github/workflows/test.yml',
                isDisabled: false,
                name: '.github/workflows/test.yml',
            },
        ]);
    });
});

describe('getLatestBuilds', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValue({
            body: { workflow_runs: [{ id: '108658767' }] },
        });
        settings.pipelines = ['108658767'];

        await github.getLatestBuilds(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api.github.com/repos/OWNER/REPO/actions/workflows/108658767/runs',
                headers: expect.objectContaining({
                    Authorization: 'Bearer mockToken',
                    'X-GitHub-Api-Version': '2022-11-28',
                    Accept: 'application/vnd.github.v3+json',
                }),
            }),
        );
    });

    it('parses builds', async () => {
        (request.get as Mock).mockResolvedValue({ body: workflowRunsJson });
        settings.pipelines = ['108658767'];

        const response = await github.getLatestBuilds(settings);

        expect(response).toEqual([
            {
                changes: [
                    {
                        name: 'Adam Nowotny',
                        message: 'ci: remove gitlab and travis scripts',
                    },
                ] as CIBuildChange[],
                id: '10056461820',
                isBroken: false,
                isRunning: false,
                isWaiting: false,
                isDisabled: false,
                name: '.github/workflows/main.yml',
                webUrl: 'https://github.com/AdamNowotny/BuildReactor/actions/runs/10056461820',
            },
        ]);
    });

    it('returns error when no runs found', async () => {
        (request.get as Mock).mockResolvedValue({ body: workflowRunsErrorJson });
        settings.pipelines = ['ID'];

        const response = await github.getLatestBuilds(settings);

        expect(response).toEqual([
            expect.objectContaining({
                id: 'ID',
                name: 'ID',
                error: {
                    name: 'Error',
                    message: 'Workflow run not found',
                },
            }),
        ]);
    });

    it('requests builds for branch only if specified', async () => {
        (request.get as Mock).mockResolvedValue({
            body: workflowRunsJson,
        });
        settings.pipelines = ['108658767'];
        settings.branch = 'github-actions';

        await github.getLatestBuilds(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api.github.com/repos/OWNER/REPO/actions/workflows/108658767/runs',
                query: { branch: 'github-actions' },
            }),
        );
    });
});
