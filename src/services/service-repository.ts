import bamboo from 'services/bamboo/bamboo';
import buildbot from 'services/buildbot/buildbot';
import buildkite from 'services/buildkite/buildkite';
import cctray from 'services/cctray/cctray';
import jenkins from 'services/jenkins/jenkins';
import teamcity from 'services/teamcity/teamcity';
import travis from 'services/travis/travis';

import type {
    CIBuild,
    CIPipelineList,
    CIService,
    CIServiceSettings,
} from './service-types';
import logger from 'common/logger';
import github from './github/github';

const serviceMap = new Map<string, CIService>();

const init = (
    services: CIService[] = [
        bamboo,
        buildbot,
        buildkite,
        cctray,
        github,
        jenkins,
        teamcity,
        travis,
    ],
) => {
    services.forEach(service => {
        register(service);
    });
};

const register = function (service: CIService) {
    const serviceDefinition = service.getDefinition();
    serviceMap.set(serviceDefinition.baseUrl, service);
};

const getAllDefinitions = function () {
    const serviceDefinitions = [...serviceMap.values()].map(service =>
        service.getDefinition(),
    );
    logger.log('service-repository.getAllDefinitions', serviceDefinitions);
    return serviceDefinitions;
};

const getPipelines = async (settings: CIServiceSettings): Promise<CIPipelineList> => {
    logger.log('service-repository.getPipelines', settings);
    const service = getService(settings.baseUrl);
    const pipelines = await service.getPipelines(settings);
    return {
        items: pipelines.sort((a, b) => a.name.localeCompare(b.name)),
        selected: settings.pipelines,
    };
};

const getService = function (baseUrl) {
    const service = serviceMap.get(baseUrl);
    if (!service) {
        throw new Error(`No service found for ${baseUrl}`);
    }
    return service;
};

const getLatestBuilds = async (settings: CIServiceSettings): Promise<CIBuild[]> => {
    const service = getService(settings.baseUrl);
    try {
        const builds = await service.getLatestBuilds(settings);
        return builds.sort((a, b) => a.name.localeCompare(b.name));
    } catch (ex: any) {
        return settings.pipelines.map(id => createErrorState(id, ex));
    }
};

const createErrorState = (id: string, ex: any): CIBuild => {
    return {
        id,
        name: id,
        error: {
            name: ex.name,
            message: 'Service update failed',
            description: ex.message,
        },
    };
};

export default {
    init,
    getAllDefinitions,
    getLatestBuilds,
    getPipelines,
};
