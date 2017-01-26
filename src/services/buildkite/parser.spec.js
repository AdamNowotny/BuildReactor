import 'test/rxHelpers';
import parser from 'services/buildkite/parser';

describe('services/buildkite/parser', () => {

    const key = { org: 'org', pipeline: 'pipeline' };
    let settings;

    beforeEach(() => {
        settings = {
            token: 'token',
            projects: ['org/pipeline1', 'org/pipeline2']
        };
    });

    describe('parseBuild', () => {

        beforeEach(() => {
            settings.projects = ['org/pipeline'];
        });

        it('should parse build', () => {
            const buildResponse = {
                web_url: 'https://buildkite.com/org/pipeline/builds/15'
            };

            const build = parser.parseBuild(buildResponse, key);

            expect(build).toEqual(jasmine.objectContaining({
                id: 'org/pipeline',
                name: 'pipeline',
                group: 'org',
                webUrl: 'https://buildkite.com/org/pipeline/builds/15',
                isBroken: false,
                isRunning: false,
                isDisabled: false,
                tags: [],
                changes: []
            }));
        });

        it('should parse failed build', () => {
            const buildResponse = {
                state: 'failed'
            };

            const build = parser.parseBuild(buildResponse, key);

            expect(build).toEqual(jasmine.objectContaining({
                isBroken: true,
            }));
        });

        it('should parse running build', () => {
            const buildResponse = {
                state: 'running'
            };

            const build = parser.parseBuild(buildResponse, key);

            expect(build).toEqual(jasmine.objectContaining({
                isRunning: true,
            }));
        });

        it('should parse waiting build', () => {
            const buildResponse = {
                state: 'scheduled'
            };

            const build = parser.parseBuild(buildResponse, key);

            expect(build).toEqual(jasmine.objectContaining({
                isWaiting: true,
            }));
        });

        it('should parse canceled as tags', () => {
            const buildResponse = {
                state: 'canceled'
            };

            const build = parser.parseBuild(buildResponse, key);

            expect(build).toEqual(jasmine.objectContaining({
                tags: [{ name: 'Canceled', type: 'warning' }],
            }));
        });

        it('should parse canceling as tags', () => {
            const buildResponse = {
                state: 'canceling'
            };

            const build = parser.parseBuild(buildResponse, key);

            expect(build).toEqual(jasmine.objectContaining({
                tags: [{ name: 'Canceled', type: 'warning' }],
            }));
        });

        it('should parse not_run as tags', () => {
            const buildResponse = {
                state: 'not_run'
            };

            const build = parser.parseBuild(buildResponse, key);

            expect(build).toEqual(jasmine.objectContaining({
                tags: [{ name: 'Not built', type: 'warning' }],
            }));
        });

        it('should parse changes', () => {
            const buildResponse = {
                message: 'message',
                creator: { name: 'creator name' }
            };

            const build = parser.parseBuild(buildResponse, key);

            expect(build).toEqual(jasmine.objectContaining({
                changes: [{ name: 'creator name', message: 'message' }],
            }));
        });

    });
});
