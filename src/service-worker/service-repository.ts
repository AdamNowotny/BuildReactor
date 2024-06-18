import { CIService } from "../common/types";

const services: { [typename: string]: CIService } = {};

const registerType = function(service: CIService) {
    const settings = service.getInfo();
    services[settings.baseUrl] = service;
};

const getSettings = function() {
    return Object.values(services).map(service => service.getInfo());
};

export default { registerType, getSettings };
