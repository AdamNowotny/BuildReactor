import fs from 'fs';
import request from 'service-worker/request';
import { CIServiceSettings } from 'services/service-types';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { parseString } from 'xml2js';
import cctray from './cctray';

vi.mock('common/logger');
vi.mock('service-worker/request');

let settings: CIServiceSettings;

beforeEach(() => {
    settings = {
        name: 'mock',
        baseUrl: 'baseUrl',
        url: 'mockUrl',
        projects: [],
        username: 'mockUsername',
        password: 'mockPassword',
    };
});

describe('getPipelines', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockImplementation(() => {
            return { body: { Projects: { Project: [] } } };
        });

        await cctray.getPipelines(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: settings.url,
                username: settings.username,
                password: settings.password,
                type: 'xml',
            }),
        );
    });

    it('parses ccnet.xml pipelines', async () => {
        (request.get as Mock).mockImplementation(() => setupResponse('ccnet.xml'));

        const response = await cctray.getPipelines(settings);

        expect(response).toContainEqual({
            id: 'CruiseControl.NET',
            name: 'CruiseControl.NET',
            group: 'CruiseControl.NET',
            isDisabled: false,
        });
        expect(response).toContainEqual({
            id: 'AspSQLProvider',
            name: 'AspSQLProvider',
            group: null,
            isDisabled: false,
        });
        expect(response).toContainEqual({
            id: 'FastForward.NET',
            name: 'FastForward.NET',
            group: 'CruiseControl.NET',
            isDisabled: false,
        });
    });

    it('assign groups from :: in name', async () => {
        (request.get as Mock).mockImplementation(() => setupResponse('go.xml'));

        const response = await cctray.getPipelines(settings);

        expect(response).toContainEqual({
            id: 'Project :: Build',
            name: 'Build',
            group: 'Project',
            isDisabled: false,
        });
        expect(response).toContainEqual({
            id: 'Project :: Build :: Build',
            name: 'Build :: Build',
            group: 'Project',
            isDisabled: false,
        });
    });
});

describe('getBuildStates', () => {
    it('passes parameters to request', async () => {
        (request.get as Mock).mockImplementation(() => {
            return { body: { Projects: { Project: [] } } };
        });

        await cctray.getBuildStates(settings);

        expect(request.get).toHaveBeenCalledWith(
            expect.objectContaining({
                url: settings.url,
                username: settings.username,
                password: settings.password,
                type: 'xml',
            }),
        );
    });

    it('parses ccnet.xml builds', async () => {
        (request.get as Mock).mockImplementation(() => setupResponse('ccnet.xml'));
        settings.projects = ['CruiseControl.NET'];

        const response = await cctray.getBuildStates(settings);

        expect(response).toContainEqual({
            changes: [],
            group: 'CruiseControl.NET',
            id: 'CruiseControl.NET',
            isBroken: false,
            isDisabled: false,
            isRunning: false,
            isWaiting: false,
            name: 'CruiseControl.NET',
            tags: [],
            webUrl: 'http://build.nauck-it.de/server/build.nauck-it.de/project/CruiseControl.NET/ViewProjectReport.aspx',
        });
    });

    it('parses build states', async () => {
        (request.get as Mock).mockImplementation(() => setupResponse('ccnet.xml'));
        settings.projects = [
            'AspSQLProvider',
            'FastForward.NET',
            'Footloose',
            'Build-Server-Config',
        ];

        const response = await cctray.getBuildStates(settings);

        expect(response).toContainEqual(
            expect.objectContaining({
                group: null,
                id: 'AspSQLProvider',
                isBroken: true,
            }),
        );
        expect(response).toContainEqual(
            expect.objectContaining({
                id: 'FastForward.NET',
                isRunning: true,
            }),
        );
        expect(response).toContainEqual(
            expect.objectContaining({
                id: 'Footloose',
                isWaiting: true,
            }),
        );
        expect(response).toContainEqual(
            expect.objectContaining({
                id: 'Build-Server-Config',
                tags: [{ name: 'Unknown', description: 'Status [unknown_state] not supported' }],
            }),
        );
    });

    it('parses go.xml builds', async () => {
        (request.get as Mock).mockImplementation(() => setupResponse('go.xml'));
        settings.projects = [
            'Project :: Build',
            'Project :: Build :: Build',
            'Project :: UnitTest',
            'Project :: UnitTest :: UnitTest',
        ];

        const response = await cctray.getBuildStates(settings);

        expect(response).toContainEqual({
            changes: [],
            group: 'Project',
            id: 'Project :: Build',
            isBroken: true,
            isDisabled: false,
            isRunning: true,
            isWaiting: false,
            name: 'Build',
            tags: [],
            webUrl: 'http://example.com/go/pipelines/Project/8/Build/1',
        });
        expect(response).toContainEqual({
            changes: [],
            group: 'Project',
            id: 'Project :: Build :: Build',
            isBroken: true,
            isDisabled: false,
            isRunning: true,
            isWaiting: false,
            name: 'Build :: Build',
            tags: [],
            webUrl: 'http://example.com/go/tab/build/detail/Project/8/Build/1/Build',
        });
    });

    it('filters monitored projects', async () => {
        (request.get as Mock).mockImplementation(() => setupResponse('go.xml'));
        settings.projects = ['Project :: Build', 'Project :: UnitTest'];

        const response = await cctray.getBuildStates(settings);

        expect(response).toHaveLength(settings.projects.length);
    });

    it('parses changes', async () => {
        (request.get as Mock).mockImplementation(() => setupResponse('go.xml'));
        settings.projects = ['Project :: UnitTest', 'Project :: UnitTest :: UnitTest'];

        const response = await cctray.getBuildStates(settings);

        expect(response).toContainEqual(
            expect.objectContaining({
                changes: [{ name: 'DOMAIN\\Username' }],
                group: 'Project',
                id: 'Project :: UnitTest',
                name: 'UnitTest',
            }),
        );
        expect(response).toContainEqual(
            expect.objectContaining({
                changes: [{ name: 'user1' }, { name: 'user2' }, { name: 'user3' }],
                id: 'Project :: UnitTest :: UnitTest',
            }),
        );
    });
});

function setupResponse(filename: string) {
    const xmlFile = fs.readFileSync(`src/services/cctray/fixtures/${filename}`, 'utf8');
    let projects;
    parseString(xmlFile, (err, data) => {
        projects = data;
    });
    return { body: projects };
}
