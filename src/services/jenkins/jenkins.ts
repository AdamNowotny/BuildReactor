import logger from 'common/logger';
import request from 'service-worker/request';
import type {
    CIBuild,
    CIBuildTag,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'common/types';

const requestJobs = (settings: CIServiceSettings) =>
    request.get({
        url: new URL(
            '/api/json?tree=' +
                'jobs[_class,name,url,buildable,fullName,' +
                'jobs[_class,name,url,buildable,fullName,' +
                'jobs[_class,name,url,buildable,fullName]' +
                ']' +
                ']',
            settings.url,
        ).href,
        username: settings.username,
        password: settings.password,
    });

const requestJobDetails = (id: string, settings: CIServiceSettings) => {
    const jobPath = `/job/${id.split('/').join('/job/')}`;
    const jobUrl = new URL(jobPath, settings.url).href;
    return request.get({
        url:
            `${jobUrl}/api/json?tree=` +
            'buildable,inQueue,' +
            'lastBuild[url,building,number,' +
            'changeSets[items[author[fullName],msg]],' +
            'changeSet[items[author[fullName],msg]]' +
            '],' +
            'lastCompletedBuild[result]',
        username: settings.username,
        password: settings.password,
    });
};

const getPipelines = async (settings: CIServiceSettings): Promise<CIPipeline[]> => {
    logger.log('jenkins.getPipelines', settings);
    const response = await requestJobs(settings);
    const jobs = response.body.jobs;
    if (!jobs) throw new Error('No jobs found');
    return jobs.flatMap(job => parsePipeline(job));
};

const parsePipeline = (job: any): CIPipeline[] => {
    const WorkflowMultiBranchProject =
        'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject';

    switch (job._class) {
        case 'jenkins.branch.OrganizationFolder':
            return parseOrganizationFolder();
        case 'com.cloudbees.hudson.plugins.folder.Folder':
        case WorkflowMultiBranchProject:
            return parseFolder();
        default:
            return [
                {
                    id: job.fullName || job.name,
                    name: job.name,
                    isDisabled: !job.buildable,
                },
            ];
    }

    function parseFolder(): CIPipeline[] {
        return job.jobs
            .flatMap(parsePipeline)
            .map(jobItem => ({ ...jobItem, group: job.name }));
    }

    function parseOrganizationFolder() {
        const folderJob = job;
        return job.jobs
            .filter(job => job._class === WorkflowMultiBranchProject)
            .flatMap(job =>
                job.jobs.flatMap(parsePipeline).map(jobItem => ({
                    ...jobItem,
                    group: folderJob.name,
                    name: `${job.name} / ${jobItem.name}`,
                })),
            );
    }
};

const getLatestBuilds = async (settings: CIServiceSettings): Promise<CIBuild[]> => {
    logger.log('jenkins.getLatestBuilds', settings);
    return Promise.all(
        settings.pipelines.map(async id => {
            try {
                const response = await requestJobDetails(id, settings);
                const build = response.body;
                return parseJobDetails(id, build);
            } catch (ex: any) {
                return createError(id, ex);
            }
        }),
    );
};
export default {
    getDefinition(): CIServiceDefinition {
        return {
            typeName: 'Jenkins',
            baseUrl: 'jenkins',
            icon: 'jenkins.png',
            logo: 'jenkins.png',
            fields: [
                {
                    type: 'url',
                    name: 'Jenkins server or view URL, e.g. http://ci.jenkins-ci.org/',
                },
                { type: 'username' },
                { type: 'password' },
            ],
            defaultConfig: {
                baseUrl: 'jenkins',
                name: '',
                pipelines: [],
                url: '',
                username: '',
                password: '',
            },
        };
    },
    getPipelines,
    getLatestBuilds,
};

const parseJobDetails = (id: string, job: any): CIBuild => {
    const [folder, project, branch] = id.split('/');
    const lastBuild = job.lastBuild || {};
    const lastCompletedBuild = job.lastCompletedBuild || {};
    let name = branch ? `${project} (${branch})` : project;
    let group: string | undefined = folder;
    if (!project) {
        name = folder;
        group = undefined;
    }
    const state: CIBuild = {
        changes: createChanges(lastBuild),
        group,
        id,
        isBroken: JOB_RESULTS.BROKEN.includes(lastCompletedBuild.result),
        isDisabled: !job.buildable,
        isRunning: lastBuild.building,
        isWaiting: job.inQueue,
        name,
        tags: createTags(lastCompletedBuild),
        webUrl: lastBuild.url,
    };
    return state;
};

const JOB_RESULTS = {
    SUPPORTED: ['SUCCESS', 'FAILURE', 'UNSTABLE', 'ABORTED', 'NOT_BUILT'],
    BROKEN: ['FAILURE', 'UNSTABLE'],
};

const createTags = lastCompletedBuild => {
    const resultName = {
        UNSTABLE: 'Unstable',
        ABORTED: 'Canceled',
        NOT_BUILT: 'Not built',
    };
    const tags: CIBuildTag[] = [];
    if (resultName[lastCompletedBuild.result]) {
        tags.push({
            name: resultName[lastCompletedBuild.result],
            type: 'warning',
        });
    }
    if (!JOB_RESULTS.SUPPORTED.includes(lastCompletedBuild.result)) {
        tags.push({
            name: 'Unknown',
            description: `Result [${lastCompletedBuild.result}] is unknown`,
        });
    }
    return tags;
};

const createChanges = lastBuild => {
    const changeSets = lastBuild.changeSet
        ? [lastBuild.changeSet]
        : lastBuild.changeSets || [];
    return []
        .concat(...changeSets.map(changeSet => changeSet.items))
        .map((change: any) => ({
            name: change.author.fullName,
            message: change.msg,
        }));
};

const createError = (id: string, ex): CIBuild => {
    const [folder, project, branch] = id.split('/');
    return {
        id,
        name: branch ? `${project} (${branch})` : project,
        group: folder,
        error: { name: 'Error', message: ex.message },
    };
};
