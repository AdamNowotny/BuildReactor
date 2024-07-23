import logger from 'common/logger';
import request from 'service-worker/request';
import type {
    CIBuild,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'services/service-types';

const getPipelines = async (settings: CIServiceSettings): Promise<CIPipeline[]> => {
    logger.log('github.getPipelines', settings);
    const response = await getWorkflows(settings);
    const { workflows } = response.body;
    const pipelines: CIPipeline[] = workflows.map(workflow => {
        return {
            id: `${workflow.id} :: ${workflow.name}`,
            name: workflow.name,
            isDisabled: workflow.state != 'active',
        };
    });
    return pipelines;
};

const getBuildStates = async (settings: CIServiceSettings): Promise<CIBuild[]> => {
    logger.log('github.getBuildStates', settings);
    return Promise.all(
        settings.projects.map(async project => {
            const [id] = project.split(' ::');
            const response = await getWorkflowRuns(settings, id);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const [run] = response.body.workflow_runs;
            return parseBuild(run, settings);
        })
    );
};

export default {
    getInfo: (): CIServiceDefinition => ({
        typeName: 'GitHub Actions',
        baseUrl: 'github',
        icon: 'services/github/icon.png',
        logo: 'services/github/logo.svg',
        fields: [
            { type: 'username', name: 'Owner' },
            { type: 'repository' },
            {
                type: 'token',
                help: 'Optional, uses current user credentis when empty<br />Create token at <a href="https://github.com/settings/personal-access-tokens/new" target="_blank">https://github.com/settings/personal-access-tokens/new</a>',
            },
            { type: 'branch' },
        ],
        defaultConfig: {
            baseUrl: 'github',
            name: '',
            projects: [],
            token: '',
            username: '',
            updateInterval: 60,
            repository: '',
        },
    }),
    getAll: (settings: CIServiceSettings): Rx.Observable<CIPipeline> =>
        Rx.Observable.fromPromise(getPipelines(settings)).flatMap(pipelines =>
            Rx.Observable.fromArray(pipelines)
        ),
    getLatest: (settings: CIServiceSettings): Rx.Observable<CIBuild> =>
        Rx.Observable.fromPromise(getBuildStates(settings)).flatMap(buildStates =>
            Rx.Observable.fromArray(buildStates)
        ),
    getPipelines,
    getBuildStates,
};

const getWorkflowRuns = async (settings: CIServiceSettings, id: string) => {
    return request.get({
        url: `https://api.github.com/repos/${settings.username}/${settings.repository}/actions/workflows/${id}/runs`,
        headers: settings.token
            ? {
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  Authorization: `Bearer ${settings.token}`,
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  'X-GitHub-Api-Version': '2022-11-28',
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  Accept: 'application/vnd.github.v3+json',
              }
            : undefined,
    });
}

const getWorkflows = async (settings: CIServiceSettings) => {
    return request.get({
        url: `https://api.github.com/repos/${settings.username}/${settings.repository}/actions/workflows`,
        headers: settings.token
            ? {
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  Authorization: `Bearer ${settings.token}`,
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  'X-GitHub-Api-Version': '2022-11-28',
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  Accept: 'application/vnd.github.v3+json',
              }
            : undefined,
    });
}

const parseBuild = (run: any, settings: CIServiceSettings) => {
    const build: CIBuild = {
        changes: [],
        group: null,
        id: run.id.toString(),
        isBroken: run.conclusion === 'failure',
        isDisabled: false,
        isRunning: run.status === 'in_progress',
        isWaiting: run.status === 'queued',
        name: run.name,
        tags: [],
        webUrl: `https://github.com/${settings.username}/${settings.repository}/actions/runs/${run.id}`,
    };
    return build;
}
