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

import sortBy from 'common/sortBy';
import type {
    CIPipelineList,
    CIService,
    CIServiceSettings,
} from './service-types';
import logger from 'common/logger';

const services: Record<string, CIService> = {};

const init = () => {
    registerType(bamboo);
    registerType(buildbot);
    registerType(buildkite);
    registerType(cc);
    registerType(ccnet);
    registerType(ccrb);
    registerType(cctray);
    registerType(go);
    registerType(jenkins);
    registerType(teamcity);
    registerType(travis);
};

const registerType = function (service: CIService) {
    const serviceDefinition = service.getInfo();
    services[serviceDefinition.baseUrl] = service;
};

const getTypes = function () {
    const serviceDefinitions = Object.values(services).map(service => {
        const serviceInfo = service.getInfo();
        serviceInfo.fields.push({
            type: 'updateInterval',
            header: 'Update interval',
            config: 'updateInterval',
        });
        return serviceInfo;
    });
    logger.log('service-monitor.getTypes', serviceDefinitions);
    return serviceDefinitions;
};

const getPipelinesFor = function (
    settings: CIServiceSettings
): Rx.Observable<CIPipelineList> {
    const pipelines = services[settings['baseUrl']].getAll(settings);
    logger.log('service-monitor.getPipelinesFor', pipelines);
    return pipelines.toArray().select(items => ({
        items: sortBy('name', items),
        selected: settings.projects,
    }));
};

export default {
    init,
    registerType,
    getTypes,
    getPipelinesFor,
};
