import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import github from './github';
import workflowJson from './workflows.json';

vi.mock('common/logger');
vi.mock('service-worker/request');

let settings: CIServiceSettings;

beforeEach(() => {
    settings = {
        name: 'mock',
        baseUrl: 'baseUrl',
        projects: [],
        username: 'mockUsername',
        repository: 'mockRepository',
        token: 'mockToken',
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
                url: 'https://api.github.com/repos/mockUsername/mockRepository/actions/workflows',
                headers: expect.objectContaining({
                    Authorization: 'Bearer mockToken',
                }),
            }),
        );
    });

    it('should parse workflows', async () => {
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
