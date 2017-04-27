import Rx from 'rx';
import requests from 'services/jenkins2/jenkins2Requests';

export default {
    getInfo() {
        return {
            typeName: 'Jenkins 2.x',
            baseUrl: 'jenkins2',
            urlHint: 'URL, e.g. http://ci.jenkins-ci.org/',
            icon: 'core/services/jenkins/icon.png',
            logo: 'core/services/jenkins/logo.png',
            defaultConfig: {
                baseUrl: 'jenkins2',
                name: '',
                projects: [],
                url: '',
                username: '',
                password: '',
                updateInterval: 60
            }
        };
    },

    /* eslint no-underscore-dangle: off */
    getAll: (settings) => requests.jobs({ url: settings.url, settings })
        .selectMany((folder) => {
            switch (folder._class) {
                case 'jenkins.branch.OrganizationFolder':
                    return Rx.Observable.fromArray(folder.jobs)
                        .where((job) =>
                            job._class === 'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject'
                        )
                        .selectMany((project) => Rx.Observable.fromArray(project.jobs)
                            .select((jobDetails) => ({
                                id: jobDetails.fullName,
                                name: `${project.name} / ${jobDetails.name}`,
                                group: folder.name,
                                isDisabled: !jobDetails.buildable
                            }))
                        );
                case 'com.cloudbees.hudson.plugins.folder.Folder':
                    return Rx.Observable.fromArray(folder.jobs)
                        .select((jobDetails) => ({
                            id: jobDetails.fullName,
                            name: `${jobDetails.name}`,
                            group: folder.name,
                            isDisabled: !jobDetails.buildable
                        }));
                default:
                    // unsupported folder class
                    return Rx.Observable.empty();
            }
        }),

    getLatest: (settings) => Rx.Observable.fromArray(settings.projects)
        .selectMany((id) => requests.jobDetails({ id, settings })
            .select((job) => {
                const [folder, project, branch] = id.split('/');
                const lastBuild = job.lastBuild || {};
                const lastCompletedBuild = job.lastCompletedBuild || {};
                const state = {
                    id,
                    name: (branch) ?
                        `${project} (${branch})` :
                        `${project}`,
                    group: folder,
                    webUrl: lastBuild.url,
                    isRunning: lastBuild.building,
                    isDisabled: !job.buildable,
                    isWaiting: job.inQueue,
                    tags: createTags(lastCompletedBuild),
                    changes: createChanges(lastBuild.changeSets)
                };
                if (jobResults.statusKnown.includes(lastCompletedBuild.result)) {
                    state.isBroken = jobResults.broken.includes(lastCompletedBuild.result);
                }
                return state;
            })
            .catch((ex) => Rx.Observable.return(createError(id, ex)))
        )
};

const jobResults = {
    supported: ['SUCCESS', 'FAILURE', 'UNSTABLE', 'ABORTED', 'NOT_BUILT'],
    statusKnown: ['SUCCESS', 'FAILURE', 'UNSTABLE'],
    broken: ['FAILURE', 'UNSTABLE']
};

const createTags = (lastCompletedBuild) => {
    const resultName = {
        'UNSTABLE': 'Unstable',
        'ABORTED': 'Canceled',
        'NOT_BUILT': 'Not built'
    };
    const tags = [];
    if (resultName[lastCompletedBuild.result]) {
        tags.push({ name: resultName[lastCompletedBuild.result], type: 'warning' });
    }
    if (!jobResults.supported.includes(lastCompletedBuild.result)) {
        tags.push({
            name: 'Unknown',
            description: `Result [${lastCompletedBuild.result}] is unknown`
        });
    }
    return tags;
};

const createChanges = (changeSets = []) => ([]
    .concat(
        ...changeSets.map((changeSet) => changeSet.items)
    ).map((change) => ({
        name: change.author.fullName,
        message: change.msg
    }))
);

const createError = (id, ex) => {
    const [folder, project, branch] = id.split('/');
    return {
        id,
        name: (branch) ?
            `${project} (${branch})` :
            `${project}`,
        group: folder,
        error: ex
    };
};
