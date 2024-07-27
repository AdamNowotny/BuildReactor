import Rx from 'rx';
import requests from 'services/jenkins/jenkinsRequests';
import type {
    CIBuild,
    CIBuildTag,
    CIPipeline,
    CIServiceDefinition,
    CIServiceSettings,
} from 'services/service-types';

const WorkflowMultiBranchProject =
    'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject';
const OrganizationFolder = 'jenkins.branch.OrganizationFolder';
const Folder = 'com.cloudbees.hudson.plugins.folder.Folder';

export default {
    getInfo(): CIServiceDefinition {
        return {
            typeName: 'Jenkins',
            baseUrl: 'jenkins',
            icon: 'services/jenkins/icon.png',
            logo: 'services/jenkins/logo.png',
            fields: [
                { type: 'url', name: 'Jenkins server or view URL, e.g. http://ci.jenkins-ci.org/' },
                { type: 'username' },
                { type: 'password' },
            ],
            defaultConfig: {
                baseUrl: 'jenkins',
                name: '',
                projects: [],
                url: '',
                username: '',
                password: '',
            },
        };
    },
    getAll: (settings: CIServiceSettings): Rx.Observable<CIPipeline> =>
        requests.jobs({ url: settings.url!, settings }).selectMany(job => {
            switch (job._class) {
                case OrganizationFolder:
                    return Rx.Observable.fromArray(job.jobs)
                        .where((project: any) => project._class === WorkflowMultiBranchProject)
                        .selectMany((project: any) =>
                            Rx.Observable.fromArray(project.jobs).select(
                                (jobDetails: any) =>
                                    ({
                                        id: jobDetails.fullName,
                                        name: `${project.name} / ${jobDetails.name}`,
                                        group: job.name,
                                        isDisabled: !jobDetails.buildable,
                                    } as CIPipeline),
                            ),
                        );
                case Folder:
                    return Rx.Observable.fromArray(job.jobs).select(
                        (jobDetails: any) =>
                            ({
                                id: jobDetails.fullName,
                                name: `${jobDetails.name}`,
                                group: job.name,
                                isDisabled: !jobDetails.buildable,
                            } as CIPipeline),
                    );
                case WorkflowMultiBranchProject:
                    return Rx.Observable.fromArray(job.jobs).select(
                        (jobDetails: any) =>
                            ({
                                id: jobDetails.fullName,
                                name: `${jobDetails.name}`,
                                group: job.name,
                                isDisabled: !jobDetails.buildable,
                            } as CIPipeline),
                    );
                default:
                    // FreeStyleProject or jenkins 1.x project
                    return Rx.Observable.return<CIPipeline>({
                        id: job.fullName || job.name,
                        name: job.name,
                        isDisabled: !job.buildable,
                    });
            }
        }),
    getLatest: (settings: CIServiceSettings): Rx.Observable<CIBuild> =>
        Rx.Observable.fromArray(settings.projects).selectMany(id =>
            requests
                .jobDetails({ id, settings })
                .select(job => parseJob(id, job))
                .catch(ex => Rx.Observable.return(createError(id, ex))),
        ),
};

const parseJob = (id: string, job: any): CIBuild => {
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
        id,
        name,
        group,
        webUrl: lastBuild.url,
        isRunning: lastBuild.building,
        isDisabled: !job.buildable,
        isWaiting: job.inQueue,
        tags: createTags(lastCompletedBuild),
        changes: createChanges(lastBuild),
    };
    if (JOB_RESULTS.BROKEN_KNOWN.includes(lastCompletedBuild.result)) {
        state.isBroken = JOB_RESULTS.BROKEN.includes(lastCompletedBuild.result);
    }
    return state;
};

const JOB_RESULTS = {
    SUPPORTED: ['SUCCESS', 'FAILURE', 'UNSTABLE', 'ABORTED', 'NOT_BUILT'],
    BROKEN_KNOWN: ['SUCCESS', 'FAILURE', 'UNSTABLE'],
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
        tags.push({ name: resultName[lastCompletedBuild.result], type: 'warning' });
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
    const changeSets = lastBuild.changeSet ? [lastBuild.changeSet] : lastBuild.changeSets || [];
    return [].concat(...changeSets.map(changeSet => changeSet.items)).map((change: any) => ({
        name: change.author.fullName,
        message: change.msg,
    }));
};

const createError = (id, ex): CIBuild => {
    const [folder, project, branch] = id.split('/');
    return {
        id,
        name: branch ? `${project} (${branch})` : `${project}`,
        group: folder,
        error: { name: 'Error', message: ex.message },
    };
};
