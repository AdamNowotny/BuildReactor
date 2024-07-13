import Rx from 'rx';
import requests from 'services/bamboo/bambooRequests';

export default {
    getInfo: () => ({
        typeName: 'Atlassian Bamboo',
        baseUrl: 'bamboo',
        icon: 'services/bamboo/icon.png',
        logo: 'services/bamboo/logo.png',
        fields: [
            {
                type: 'url',
                name: 'Server URL, e.g. http://ci.openmrs.org/',
                help: 'For Bamboo OnDemand use https://[your_account].atlassian.net/builds'
            },
            { type: 'username' },
            { type: 'password' }
        ],
        defaultConfig: {
            baseUrl: 'bamboo',
            name: '',
            projects: [],
            url: '',
            username: '',
            password: '',
            updateInterval: 60
        }
    }),
    getAll: (settings) => requests.projects(settings)
        .selectMany((project) => Rx.Observable.fromArray(project.plans.plan)
            .select((plan) => ({
                id: plan.key,
                name: plan.shortName,
                group: plan.projectName,
                isDisabled: !plan.enabled
            }))
        ),
    getLatest: (settings) => Rx.Observable.fromArray(settings.projects)
        .selectMany((key) => requests.plan(key, settings)
            .zip(requests.result(key, settings), (plan, result) =>
                parseBuild(key, settings, plan, result)
            )
            .catch((ex) => Rx.Observable.return(({
                id: key,
                name: key,
                group: null,
                error: { message: ex.message }
            })))
        )
};

const parseBuild = (id, settings, planResponse, resultResponse) => {
    const state = {
        id,
        name: planResponse.shortName,
        group: planResponse.projectName,
        webUrl: new URL(`browse/${resultResponse.key}`, settings.url).href,
        isBroken: resultResponse.state === 'Failed',
        isRunning: planResponse.isBuilding,
        isWaiting: planResponse.isActive,
        isDisabled: !planResponse.enabled,
        tags: [],
        changes: resultResponse.changes ? resultResponse.changes.change.map((change) => ({
            name: change.author,
            message: change.comment
        })) : []
    };
    if (!(resultResponse.state in { 'Successful': 1, 'Failed': 1 })) {
        state.tags.push({ name: 'Unknown', description: `State [${resultResponse.state}] not supported` });
        delete state.isBroken;
    }
    return state;
};
