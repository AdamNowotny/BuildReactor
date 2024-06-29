import bamboo from "services/bamboo/bamboo";
import buildbot from "services/buildbot/buildbot";
import buildkite from "services/buildkite/buildkite";
import cc from "services/cruisecontrol/cruisecontrol";
import ccnet from "services/cruisecontrol.net/cruisecontrol.net";
import ccrb from "services/cruisecontrol.rb/cruisecontrol.rb";
import cctray from "services/cctray/cctray";
import go from "services/go/go";
import jenkins from "services/jenkins/jenkins";
import teamcity from "services/teamcity/teamcity";
import travis from "services/travis/travis";

import sortBy from "common/sortBy";
import type { CIService, CIServiceSettings } from "./service-types";
import logger from "common/logger";

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
    const settings = service.getInfo();
    services[settings.baseUrl] = service;
};

const getTypes = function () {
    const settings = Object.values(services).map((service) => {
        const serviceInfo = service.getInfo();
        serviceInfo.fields.push({
            type: "updateInterval",
            header: "Update interval",
            config: "updateInterval",
        });
        return serviceInfo;
    });
    logger.log("service-monitor.getTypes", settings);
    return settings;
};

const getPipelinesFor = function (settings: CIServiceSettings) {
    const pipelines: any = services[settings["baseUrl"]].getAll(settings);
    logger.log("service-repository.getPipelinesFor", pipelines);
    return pipelines
        .toArray()
        .select((items) => ({ items: sortBy("name", items) }));
};

export default {
    init,
    registerType,
    getTypes,
    getPipelinesFor,
};
