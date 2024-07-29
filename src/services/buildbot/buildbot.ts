import logger from 'common/logger';
import Rx from 'rx';
import request from 'service-worker/request';
import type { CIBuild, CIPipeline, CIServiceSettings } from 'services/service-types';

const requestBuilders = (settings: CIServiceSettings) =>
    request.get({
        url: new URL('api/v2/builders', settings.url).href,
        type: 'json',
        username: settings.username,
        password: settings.password,
    });

const requestLastBuild = (id: string, settings: CIServiceSettings) =>
    request.get({
        url: new URL(`api/v2/builders/${id}/builds`, settings.url).href,
        query: { limit: 1, order: '-number' },
        type: 'json',
        username: settings.username,
        password: settings.password,
    });

const getPipelines = async (settings: CIServiceSettings): Promise<CIPipeline[]> => {
    logger.log('buildbot.getPipelines', settings);
    const response = await requestBuilders(settings);
    const { builders } = response.body;
    const pipelines: CIPipeline[] = builders.map(builder => ({
        id: builder.name,
        name: builder.name,
    }));
    return pipelines;
};

const getBuildStates = async (settings: CIServiceSettings): Promise<CIBuild[]> => {
    logger.log('buildbot.getBuildStates', settings);
    return Promise.all(
        settings.projects.map(async id => {
            try {
                const response = await requestLastBuild(id, settings);
                const [build] = response.body.builds;
                return parseBuild(id, settings, build);
            } catch (ex: any) {
                return {
                    id: id,
                    name: id,
                    error: { name: 'Error', message: ex.message },
                };
            }
        }),
    );
};

export default {
    getInfo: () => ({
        typeName: 'BuildBot',
        baseUrl: 'buildbot',
        icon: 'services/buildbot/icon.png',
        logo: 'services/buildbot/logo.png',
        fields: [
            { type: 'url', name: 'Server URL, e.g. https://build.webkit.org/' },
            { type: 'username' },
            { type: 'password' },
        ],
        defaultConfig: {
            baseUrl: 'buildbot',
            name: '',
            projects: [],
            url: '',
            username: '',
            password: '',
        },
    }),
    getAll: (settings: CIServiceSettings): Rx.Observable<CIPipeline> =>
        Rx.Observable.fromPromise(getPipelines(settings)).flatMap(pipelines =>
            Rx.Observable.fromArray(pipelines),
        ),
    getLatest: (settings: CIServiceSettings): Rx.Observable<CIBuild> =>
        Rx.Observable.fromPromise(getBuildStates(settings)).flatMap(buildStates =>
            Rx.Observable.fromArray(buildStates),
        ),
    getPipelines,
    getBuildStates,
};

enum BuildResultCodes {
    SUCCESS = 0,
    WARNINGS = 1,
    FAILURE = 2,
    SKIPPED = 3,
    EXCEPTION = 4,
    RETRY = 5,
    CANCELLED = 6,
}

const parseBuild = (id, settings, build): CIBuild => ({
    id,
    name: id,
    webUrl: new URL(`/#/builders/${id}/builds/${build.number}`, settings.url).href,
    isBroken: build.results !== BuildResultCodes.SUCCESS,
    isRunning: !build.complete,
});
