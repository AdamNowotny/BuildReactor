import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import buildJson from './build.json';
import buildTypesJson from './buildtypes.json';
import teamcity from './teamcity';

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
        (request.get as Mock).mockResolvedValue({ body: buildTypesJson });

        await teamcity.getPipelines(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://example.com/httpAuth/app/rest/buildTypes',
                query: {
                    fields: 'buildType(id,name,projectName,paused)',
                },
                type: 'json',
                username: settings.username,
                password: settings.password,
            }),
        );
    });

    it('parses builders', async () => {
        (request.get as Mock).mockResolvedValue({ body: buildTypesJson });

        const response = await teamcity.getPipelines(settings);

        expect(response).toHaveLength(10);
        expect(response[0]).toEqual({
            id: 'OpenSourceProjects_AbsaOSS_ABRiS_AutoDeployScala211',
            name: 'Auto Deploy [scala-2.11, spark-2.4]',
            group: 'Open-source projects / AbsaOSS / ABRiS',
            isDisabled: false,
        });
    });
});

describe('getLatestBuilds', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockResolvedValue({ body: buildJson });
        settings.projects = ['Kotlin_KotlinRunCodeBuildPublishToNpm'];

        await teamcity.getLatestBuilds(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://example.com/httpAuth/app/rest/builds',
                username: settings.username,
                password: settings.password,
                type: 'json',
                query: {
                    fields: 'build(running,status,webUrl,buildType(name,projectName),changes(change(comment,username,user(username))))',
                    locator:
                        'buildType:Kotlin_KotlinRunCodeBuildPublishToNpm,running:any,count:1',
                },
            }),
        );
    });

    it('passes branch to request', async () => {
        (request.get as Mock).mockResolvedValue({ body: buildJson });
        settings.projects = ['PROJECT1'];
        settings.branch = 'refs/heads/master';

        await teamcity.getLatestBuilds(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                query: expect.objectContaining({
                    locator:
                        'buildType:PROJECT1,running:any,count:1,branch:(refs/heads/master)',
                }),
            }),
        );
    });

    it('fails when build not found', async () => {
        (request.get as Mock).mockResolvedValue({ body: { build: [] } });
        settings.projects = ['PROJECT1'];
        settings.branch = 'refs/heads/master';

        const response = await teamcity.getLatestBuilds(settings);

        expect(response).toEqual([
            expect.objectContaining({
                error: {
                    message: 'No build for branch [refs/heads/master]',
                    name: 'Error',
                },
                id: 'PROJECT1',
                name: 'PROJECT1',
            }),
        ]);
    });

    it('parses builds', async () => {
        (request.get as Mock).mockResolvedValue({ body: buildJson });
        settings.projects = ['Kotlin_KotlinRunCodeBuildPublishToNpm'];

        const response = await teamcity.getLatestBuilds(settings);

        expect(response).toEqual([
            {
                changes: [
                    {
                        message: 'Merge pull request #198 from JetBrains/pre-130',
                        name: 'kb.chernenko',
                    },
                    {
                        message: 'chore: bump version to 1.30.0',
                        name: 'kb.chernenko',
                    },
                    {
                        message: 'fix(crosslink); hide crosslink for jslibs',
                        name: 'kb.chernenko',
                    },
                ],
                id: 'Kotlin_KotlinRunCodeBuildPublishToNpm',
                name: 'Build & Publish to NPM',
                group: 'Kotlin / Kotlin Playground',
                isBroken: false,
                isRunning: false,
                isWaiting: false,
                webUrl: 'https://teamcity.jetbrains.com/buildConfiguration/Kotlin_KotlinRunCodeBuildPublishToNpm/4433050',
            },
        ]);
    });
});
