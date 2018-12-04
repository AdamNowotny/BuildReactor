import Rx from 'rx';
import joinUrl from 'common/joinUrl';
import requests from 'services/travis/travisRequests';

export default {
    getInfo: () => ({
        typeName: 'Travis',
        baseUrl: 'travis',
        icon: 'services/travis/icon.png',
        logo: 'services/travis/logo.png',
        fields: [
            {
                type: 'url',
                name: 'API URL',
                config: 'apiUrl',
                help: 'Public: https://api.travis-ci.org, Private: https://api.travis-ci.com or custom url'
            },
            {
                type: 'url',
                name: 'Web URL',
                config: 'webUrl',
                help: 'Public: https://travis-ci.org, Private: https://travis-ci.com or custom url'
            },
            {
                type: 'token',
                help: 'Copy token from <a href="https://travis-ci.org/account/preferences" target="_blank">https://travis-ci.org/account/preferences</a>'
            }
        ],
        defaultConfig: {
            baseUrl: 'travis',
            name: '',
            apiUrl: 'https://api.travis-ci.org/',
            webUrl: 'https://travis-ci.org/',
            projects: [],
            token: '',
            updateInterval: 60
        }
    }),
    getAll: (settings) => requests.repositories(settings)
        .where((repo) => repo.active)
        .select((repo) => ({
            id: repo.slug,
            name: repo.name,
            group: repo.slug.split('/')[0],
            isDisabled: false
        })),
    getLatest: (settings) => Rx.Observable.fromArray(settings.projects)
        .select(createKey)
        .selectMany((key) => requests.builds(key.id, settings)
            .select((build) => ({
                id: key.id,
                name: key.repo,
                group: key.org,
                webUrl: joinUrl(settings.webUrl, `${key.id}/builds/${build.id}`),
                isBroken: BUILD_STATES.BROKEN_KNOWN.includes(build.state) ?
                    BUILD_STATES.BROKEN.includes(build.state) :
                    BUILD_STATES.BROKEN.includes(build.previous_state),
                isRunning: build.state === 'started',
                isWaiting: build.state === 'created',
                isDisabled: false,
                tags: createTags(build),
                changes: createChanges(build)
            }))
            .catch((ex) => Rx.Observable.return({
                id: key.id,
                name: key.repo,
                group: key.org,
                error: { message: ex.message }
            }))
        )
};

const BUILD_STATES = {
    SUPPORTED: ['created', 'started', 'passed', 'failed', 'errored', 'canceled'],
    BROKEN_KNOWN: ['passed', 'failed', 'errored'],
    BROKEN: ['failed', 'errored'],
    CANCELED: ['canceled']
};

const createKey = (stringId) => {
    const [org, repo] = stringId.split('/');
    return {
        id: stringId,
        org,
        repo
    };
};

const createTags = (build) => {
    const tags = [];
    if (['errored'].includes(build.state)) {
        tags.push({ name: 'Errored', type: 'warning' });
    }
    if (!BUILD_STATES.SUPPORTED.includes(build.state)) {
        tags.push({
            name: 'Unknown',
            type: 'warning',
            description: `Result [${build.state}] is unknown`
        });
    }
    if (BUILD_STATES.CANCELED.includes(build.state)) {
        tags.push({
            name: 'Canceled',
            type: 'warning',
            description: `Build was canceled`
        });
    }
    return tags;
};

const createChanges = (build) => {
    if (!(build.commit && build.commit.author)) {
        return [];
    }
    return [{
        name: build.commit.author.name,
        message: build.commit.message
    }];
};
