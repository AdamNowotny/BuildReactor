import bamboo from 'services/bamboo/bamboo';
import buildbot from 'services/buildbot/buildbot';
import buildkite from 'services/buildkite/buildkite';
import cctray from 'services/cctray/cctray';
import jenkins from 'services/jenkins/jenkins';
import teamcity from 'services/teamcity/teamcity';
import travis from 'services/travis/travis';

import type { CIPipelineList, CIService, CIServiceSettings } from './service-types';
import logger from 'common/logger';
import github from './github/github';

const services: Record<string, CIService> = {};

const init = () => {
    register(bamboo);
    register(buildbot);
    register(buildkite);
    register(cctray);
    register(github);
    register(jenkins);
    register(teamcity);
    register(travis);
};

const register = function (service: CIService) {
    const serviceDefinition = service.getInfo();
    services[serviceDefinition.baseUrl] = service;
};

const getAllDefinitions = function () {
    const serviceDefinitions = Object.keys(services).map(getDefinition);
    logger.log('service-repository.getAllDefinitions', serviceDefinitions);
    return serviceDefinitions;
};

const getDefinition = function (baseUrl: string) {
    return services[baseUrl].getInfo();
};

const getPipelinesFor = function (settings: CIServiceSettings): Rx.Observable<CIPipelineList> {
    const pipelines = services[settings['baseUrl']].getAll(settings);
    logger.log('service-repository.getPipelinesFor', pipelines);
    return pipelines.toArray().select(items => ({
        items: items.sort((a, b) => a.name.localeCompare(b.name)),
        selected: settings.projects,
    }));
};

const getService = function (baseUrl) {
    return services[baseUrl];
};

export default {
    init,
    getService,
    getAllDefinitions,
    getDefinition,
    getPipelinesFor,
};
