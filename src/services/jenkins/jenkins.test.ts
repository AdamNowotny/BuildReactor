import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import jenkins from './jenkins';
import jobDetailsJson from './jobDetails.json';
import jobsJson from './jobs.json';

vi.mock('common/logger');
vi.mock('service-worker/request');

let settings: CIServiceSettings;

beforeEach(() => {
    settings = {
        name: 'mock',
        baseUrl: 'baseUrl',
        projects: [],
        url: 'https://example.com/',
        username: 'USERNAME',
        password: 'PASSWORD',
    };
});

describe('getPipelines', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValue({ body: jobsJson });

        await jenkins.getPipelines(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://example.com/api/json?tree=jobs[_class,name,url,buildable,fullName,jobs[_class,name,url,buildable,fullName,jobs[_class,name,url,buildable,fullName]]]',
                username: settings.username,
                password: settings.password,
            }),
        );
    });

    it('fails when no repos', async () => {
        (request.get as Mock).mockResolvedValue({ body: {} });

        await expect(jenkins.getPipelines(settings)).rejects.toThrow('No jobs found');
    });

    it('parses jobs', async () => {
        (request.get as Mock).mockResolvedValue({ body: jobsJson });

        const response = await jenkins.getPipelines(settings);

        expect(response).toHaveLength(7);
        expect(response).toEqual(
            expect.arrayContaining([
                {
                    id: 'freestyle-project',
                    name: 'freestyle-project',
                    isDisabled: false,
                },
            ]),
        );
    });

    it('parses Folder jobs', async () => {
        (request.get as Mock).mockResolvedValue({ body: jobsJson });

        const response = await jenkins.getPipelines(settings);

        expect(response).toEqual(
            expect.arrayContaining([
                {
                    id: 'Infrastructure/patron',
                    name: 'patron',
                    group: 'Infrastructure',
                    isDisabled: false,
                },
            ]),
        );
    });

    it('parses WorkflowMultiBranchProject jobs', async () => {
        (request.get as Mock).mockResolvedValue({ body: jobsJson });

        const response = await jenkins.getPipelines(settings);

        expect(response).toEqual(
            expect.arrayContaining([
                {
                    id: 'job23/master',
                    name: 'master',
                    group: 'job23',
                    isDisabled: false,
                },
                {
                    id: 'job23/myOtherFeatureBranch',
                    name: 'myOtherFeatureBranch',
                    group: 'job23',
                    isDisabled: true,
                },
            ]),
        );
    });

    it('parses OrganizationFolder jobs', async () => {
        (request.get as Mock).mockResolvedValue({ body: jobsJson });

        const response = await jenkins.getPipelines(settings);

        expect(response).toEqual(
            expect.arrayContaining([
                {
                    id: 'Core/acceptance-test-harness/PR-157',
                    name: 'acceptance-test-harness / PR-157',
                    group: 'Core',
                    isDisabled: true,
                },
                {
                    id: 'Core/acceptance-test-harness/PR-238',
                    name: 'acceptance-test-harness / PR-238',
                    group: 'Core',
                    isDisabled: false,
                },
            ]),
        );
    });
});

describe('getLatestBuilds', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValue({ body: jobDetailsJson });
        settings.projects = ['org/repo'];

        await jenkins.getLatestBuilds(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://example.com/job/org/job/repo/api/json?tree=buildable,inQueue,lastBuild[url,building,number,changeSets[items[author[fullName],msg]],changeSet[items[author[fullName],msg]]],lastCompletedBuild[result]',
                username: settings.username,
                password: settings.password,
            }),
        );
    });

    it('parses build', async () => {
        settings.projects = ['org/repo1'];
        (request.get as Mock).mockResolvedValue({ body: jobDetailsJson });

        const response = await jenkins.getLatestBuilds(settings);

        expect(response).toEqual([
            {
                changes: [
                    {
                        name: 'user1',
                        message: '[maven-release-plugin] prepare release jenkins-2.56',
                    },
                    {
                        name: 'user1',
                        message:
                            '[maven-release-plugin] prepare for next development iteration',
                    },
                ],
                group: 'org',
                id: 'org/repo1',
                isBroken: false,
                isDisabled: false,
                isRunning: false,
                isWaiting: false,
                name: 'repo1',
                tags: [{ name: 'Canceled', type: 'warning' }],
                webUrl: 'https://ci.jenkins.io/job/Core/job/jenkins/job/master/358/',
            },
        ]);
    });
});
