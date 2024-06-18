import { CIService, CIServiceSettings } from "../common/types";
import logger from "./logger";

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

export default { registerType, getSettings };
