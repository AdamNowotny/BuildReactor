import logger from 'common/logger';
import request from 'service-worker/request';
import type {
    CIBuild,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'common/types';

const getPipelines = async (settings: CIServiceSettings): Promise<CIPipeline[]> => {
    logger.log('github.getPipelines', settings);
    const response = await requestWorkflows(settings);
    const { workflows } = response.body;
    const pipelines: CIPipeline[] = workflows.map(workflow => {
        return {
            id: `${workflow.id} | ${workflow.name}`,
            name: workflow.name,
            isDisabled: workflow.state != 'active',
        };
    });
    return pipelines;
};

const getLatestBuilds = async (settings: CIServiceSettings): Promise<CIBuild[]> => {
    logger.log('github.getLatestBuilds', settings);
    const pipelines = settings.pipelines.map(
        async (pipelineId: string): Promise<CIBuild> => {
            try {
                const [id] = pipelineId.split(' |');
                const response = await requestWorkflowRuns(settings, id);
                const [run] = response.body.workflow_runs;
                if (!run) {
                    throw new Error('Workflow run not found');
                }
                return parseBuild(run);
            } catch (ex: any) {
                return {
                    id: pipelineId,
                    name: pipelineId,
                    error: { name: 'Error', message: ex.message },
                };
            }
        },
    );
    logger.log('github.getLatestBuilds.pipeline', pipelines);
    return await Promise.all(pipelines);
};

export default {
    getDefinition: (): CIServiceDefinition => ({
        typeName: 'GitHub Actions',
        baseUrl: 'github',
        icon: 'services/github/icon.png',
        logo: 'services/github/logo.svg',
        fields: [
            {
                type: 'url',
                name: 'Github URL, f.e. https://github.com/AdamNowotny/BuildReactor',
            },
            {
                type: 'token',
                help: 'Create token at <a href="https://github.com/settings/personal-access-tokens/new" target="_blank">https://github.com/settings/personal-access-tokens/new</a>',
            },
            { type: 'branch' },
        ],
        defaultConfig: {
            baseUrl: 'github',
            url: '',
            name: '',
            pipelines: [],
            token: '',
        },
    }),
    getPipelines,
    getLatestBuilds,
};

const requestWorkflowRuns = async (settings: CIServiceSettings, id: string) => {
    if (!settings.url) throw new Error('No url provided');
    const [_origin, owner, repo] = new URL(settings.url).pathname.split('/');
    return request.get({
        url: `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${id}/runs`,
        query: settings.branch
            ? {
                  branch: settings.branch,
              }
            : undefined,
        headers: createHeaders(settings),
    });
};

const requestWorkflows = async (settings: CIServiceSettings) => {
    if (!settings.url) throw new Error('No url provided');
    const [_origin, owner, repo] = new URL(settings.url).pathname.split('/');
    return request.get({
        url: `https://api.github.com/repos/${owner}/${repo}/actions/workflows`,
        headers: createHeaders(settings),
    });
};

const parseBuild = (run: any) => {
    const build: CIBuild = {
        changes: [
            {
                name: run.head_commit?.author?.name,
                message: run.head_commit?.message,
            },
        ],
        id: run.id.toString(),
        isBroken: run.conclusion === 'failure',
        isDisabled: false,
        isRunning: run.status === 'in_progress',
        isWaiting: run.status === 'queued',
        name: run.name,
        webUrl: run.html_url,
    };
    return build;
};

function createHeaders(settings: CIServiceSettings): HeadersInit | undefined {
    return settings.token
        ? {
              Authorization: `Bearer ${settings.token}`,
              'X-GitHub-Api-Version': '2022-11-28',
              Accept: 'application/vnd.github.v3+json',
          }
        : undefined;
}
