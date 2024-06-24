import sortBy from "common/sortBy";
import { CIService, CIServiceSettings } from "../common/types";
import logger from "common/logger";

const services: { [typename: string]: CIService } = {};

const registerType = function(service: CIService) {
    const settings = service.getInfo();
    services[settings.baseUrl] = service;
};

const getSettings = function() {
    return Object.values(services).map(service => {
        const serviceInfo = service.getInfo();
        if (serviceInfo.fields) {
            serviceInfo.fields.push(
                { type: 'updateInterval', header: 'Update interval', config: 'updateInterval' }
            );
        }
        return serviceInfo;
    });
};

const getPipelinesFor = function(settings: CIServiceSettings) {
    const pipelines: any = services[settings["baseUrl"]].getAll(settings);
    logger.log('service-repository.getPipelinesFor', pipelines);
    return pipelines
            .toArray()
            .select((items) => ({ items: sortBy('name', items) }));
};

export default { registerType, getSettings, getPipelinesFor };
