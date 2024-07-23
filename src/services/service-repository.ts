import bamboo from 'services/bamboo/bamboo';
import buildbot from 'services/buildbot/buildbot';
import buildkite from 'services/buildkite/buildkite';
import cc from 'services/cruisecontrol/cruisecontrol';
import ccnet from 'services/cruisecontrol.net/cruisecontrol.net';
import ccrb from 'services/cruisecontrol.rb/cruisecontrol.rb';
import cctray from 'services/cctray/cctray';
import go from 'services/go/go';
import jenkins from 'services/jenkins/jenkins';
import teamcity from 'services/teamcity/teamcity';
import travis from 'services/travis/travis';

import type {
    CIPipelineList,
    CIService,
    CIServiceSettings,
} from './service-types';
import logger from 'common/logger';
import github from './github/github';

const services: Record<string, CIService> = {};

const init = () => {
    register(bamboo);
    register(buildbot);
    register(buildkite);
    register(cc);
    register(ccnet);
    register(ccrb);
    register(cctray);
    register(github)
    register(go);
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
    const serviceDefinition = services[baseUrl].getInfo();
    serviceDefinition.fields.push({
        type: 'updateInterval',
        header: 'Update interval',
        config: 'updateInterval',
    });
    return serviceDefinition;
};

const getPipelinesFor = function (
    settings: CIServiceSettings
): Rx.Observable<CIPipelineList> {
    const pipelines = services[settings['baseUrl']].getAll(settings);
    logger.log('service-repository.getPipelinesFor', pipelines);
    return pipelines.toArray().select(items => ({
        items: items.sort((a, b) => a.name.localeCompare(b.name)),
        selected: settings.projects,
    }));
};

const getService = function (baseUrl) {
    return services[baseUrl];
}

export default {
    init,
    getService,
    getAllDefinitions,
    getDefinition,
    getPipelinesFor,
};
