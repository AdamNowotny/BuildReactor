import Rx from 'rx';
import requests from 'services/teamcity/teamcityRequests';

export default {
    getInfo: () => ({
        typeName: 'TeamCity',
        baseUrl: 'teamcity',
        icon: 'services/teamcity/icon.png',
        logo: 'services/teamcity/logo.png',
        fields: [
            { type: 'url', name: 'Server URL, e.g. http://teamcity.jetbrains.com/' },
            { type: 'username' },
            { type: 'password' },
            { type: 'branch' }
        ],
        defaultConfig: {
            baseUrl: 'teamcity',
            name: '',
            projects: [],
            url: '',
            username: '',
            password: '',
            branch: '',
            updateInterval: 60
        }
    }),
    getAll: (settings) => requests.buildTypes(settings)
        .select(parseAvailableBuilds)
        .selectMany((projects) => Rx.Observable.fromArray(projects)),
    getLatest: (settings) => Rx.Observable.fromArray(settings.projects)
        .selectMany((id) => requests.builds(id, settings)
            .select((build) => failIfBranchNotFound(build, settings))
            .select((builds) => builds.build[0])
            .select(validateBuild)
            .select((build) => parseBuild(id, settings, build))
            .catch((ex) => Rx.Observable.return(({
                id,
                name: id,
                group: null,
                error: { message: ex.message }
            })))
        )
};

function parseAvailableBuilds(apiJson) {
    return apiJson.buildType ? apiJson.buildType.map((item) => ({
        id: item.id,
        name: item.name,
        group: item.projectName,
        isDisabled: false
    })) : [];
}

const failIfBranchNotFound = (build, settings) => {
    if (build.build.length === 0) {
        throw new Error(`No build for branch [${settings.branch}]`);
    }
    return build;
};

const validateBuild = (build) => {
    if (!['FAILURE', 'ERROR', 'SUCCESS'].includes(build.status)) {
        throw new Error(`Status [${build.status}] not supported`);
    }
    return build;
};

const parseBuild = (id, settings, build) => ({
    id,
    name: build.buildType.name,
    group: build.buildType.projectName,
    webUrl: build.webUrl,
    isBroken: ['FAILURE', 'ERROR'].includes(build.status),
    isRunning: build.running,
    isDisabled: false,
    changes: build.changes ? build.changes.change.map((change) => ({
        name: change.user ? change.user.username : change.username,
        message: change.comment.split('\n')[0]
    })) : []
});
