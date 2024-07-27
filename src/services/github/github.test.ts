import request from 'service-worker/request';
import { CIBuildChange, CIServiceSettings } from 'services/service-types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import github from './github';
import workflowJson from './workflows.json';
import workflowRunsJson from './workflow-runs.json';

vi.mock('common/logger');
vi.mock('service-worker/request');

let settings: CIServiceSettings;

beforeEach(() => {
    settings = {
        name: 'mock',
        baseUrl: 'baseUrl',
        projects: [],
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

describe('getBuildStates', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValue({
            body: { workflow_runs: [{ id: '108658767' }] },
        });
        settings.projects = ['108658767'];

        await github.getBuildStates(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://api.github.com/repos/OWNER/REPO/actions/workflows/108658767/runs',
                headers: expect.objectContaining({
                    Authorization: 'Bearer mockToken',
                }),
            }),
        );
    });

    it('parses builds', async () => {
        (request.get as Mock).mockResolvedValue({
            body: workflowRunsJson,
        });
        settings.projects = ['108658767'];

        const response = await github.getBuildStates(settings);

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
});
