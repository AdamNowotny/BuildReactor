import 'rx/dist/rx.binding';
import Rx from 'rx';
import logger from './logger';
import testActiveProjects from './__mocks__/core.mock.activeProjects';
import testViews from './__mocks__/core.mock.views';
import testConfigurations from './__mocks__/core.mock.configurations';
import testServices from './__mocks__/core.mock.serviceTypes';
import testAvailableProjects from './__mocks__/core.mock.availableProjects';

import {
    CIServiceSettings,
    ViewConfig,
    ServiceStateItem,
    CIServiceDefinition,
    CIPipelineList,
} from 'common/types';

// replaced by Vite
const TEST: string = import.meta.env.VITE_MOCK_WORKER;
const init = function () {
    if (TEST === '1') {
        activeProjects.onNext(testActiveProjects);
        configurations.onNext(testConfigurations);
        views.onNext(testViews);
        return;
    }
    const statePort = chrome.runtime.connect({ name: 'state' });
    statePort.onMessage.addListener(message => {
        activeProjects.onNext(message);
        logger.info('core.state', message);
    });
    const configPort = chrome.runtime.connect({ name: 'configuration' });
    configPort.onMessage.addListener(message => {
        configurations.onNext(message);
        logger.info('core.configuration', message);
    });
    const viewConfigPort = chrome.runtime.connect({ name: 'views' });
    viewConfigPort.onMessage.addListener(message => {
        views.onNext(message);
        logger.info('core.view', message);
    });
};

const activeProjects = new Rx.ReplaySubject<ServiceStateItem[]>(1);
const configurations = new Rx.ReplaySubject<CIServiceSettings[]>(1);
const views = new Rx.ReplaySubject<ViewConfig>(1);

const availableServices = (callback: (callback: CIServiceDefinition[]) => void) => {
    const message = { name: 'availableServices' };
    logger.info('availableServices', message);
    if (TEST) {
        callback(testServices);
    } else {
        chrome.runtime.sendMessage(message, callback);
    }
};

const availableProjects = (
    settings: CIServiceSettings,
    callback: ({ pipelines, error }: { pipelines: CIPipelineList; error? }) => void,
) => {
    const message = { name: 'availableProjects', serviceSettings: settings };
    logger.info('availableProjects', message);
    if (TEST) {
        callback(testAvailableProjects);
    } else {
        chrome.runtime.sendMessage(message, callback);
    }
};

const setOrder = function (serviceNames: string[]) {
    const message = { name: 'setOrder', order: serviceNames };
    logger.info('setOrder', message);
    void chrome.runtime.sendMessage(message);
};

const setBuildOrder = function (serviceName: string, builds: string[]) {
    const message = { name: 'setBuildOrder', serviceName, order: builds };
    logger.info('setBuildOrder', message);
    void chrome.runtime.sendMessage(message);
};

const enableService = function (name: string) {
    const message = { name: 'enableService', serviceName: name };
    logger.info('enableService', message);
    void chrome.runtime.sendMessage(message);
};

const disableService = function (name: string) {
    const message = { name: 'disableService', serviceName: name };
    logger.info('disableService', message);
    void chrome.runtime.sendMessage(message);
};

const removeService = function (name: string) {
    const message = { name: 'removeService', serviceName: name };
    logger.info('removeService', message);
    void chrome.runtime.sendMessage(message);
};

const renameService = function (oldName: string, newName: string) {
    const message = { name: 'renameService', oldName, newName };
    logger.info('renameService', message);
    void chrome.runtime.sendMessage(message);
};

const saveService = function (settings: CIServiceSettings) {
    const message = { name: 'saveService', settings };
    logger.info('saveService', message);
    void chrome.runtime.sendMessage(message);
};

const saveConfig = function (config: CIServiceSettings) {
    const message = { name: 'saveConfig', config };
    logger.info('saveConfig', config);
    void chrome.runtime.sendMessage(message);
};

const setViews = function (viewConfig: ViewConfig) {
    const message = { name: 'setViews', views: viewConfig };
    logger.info('setViews', message);
    void chrome.runtime.sendMessage(message);
};

export default {
    activeProjects,
    availableProjects,
    availableServices,
    configurations,
    disableService,
    enableService,
    init,
    removeService,
    renameService,
    saveConfig,
    saveService,
    setBuildOrder,
    setOrder,
    setViews,
    views,
};
