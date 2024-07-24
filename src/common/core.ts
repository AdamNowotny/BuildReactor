import 'rx/dist/rx.binding';
import Rx from 'rx';
import logger from './logger';

const init = function () {
    const statePort = chrome.runtime.connect({ name: 'state' });
    statePort.onMessage.addListener(function (message) {
        activeProjects.onNext(message);
    });
    const configPort = chrome.runtime.connect({ name: 'configuration' });
    configPort.onMessage.addListener(function (message) {
        configurations.onNext(message);
    });
    const viewConfigPort = chrome.runtime.connect({ name: 'views' });
    viewConfigPort.onMessage.addListener(function (message) {
        views.onNext(message);
    });
};

const activeProjects = new Rx.ReplaySubject(1);
const configurations = new Rx.ReplaySubject(1);
const views = new Rx.ReplaySubject(1);

const availableServices = function (callback) {
    const message = { name: 'availableServices' };
    logger.log('availableServices', message);
    chrome.runtime.sendMessage(message, callback);
};

const availableProjects = function (settings, callback) {
    const message = { name: 'availableProjects', serviceSettings: settings };
    logger.log('availableProjects', message);
    chrome.runtime.sendMessage(message, function (response) {
        logger.log('availableProjects', { response, serviceSettings: settings });
        callback(response);
    });
};

const setOrder = function (serviceNames) {
    const message = { name: 'setOrder', order: serviceNames };
    logger.log('setOrder', message);
    void chrome.runtime.sendMessage(message);
};

const setBuildOrder = function (serviceName, builds) {
    const message = { name: 'setBuildOrder', serviceName, order: builds };
    logger.log('setBuildOrder', message);
    void chrome.runtime.sendMessage(message);
};

const enableService = function (name) {
    const message = { name: 'enableService', serviceName: name };
    logger.log('enableService', message);
    void chrome.runtime.sendMessage(message);
};

const disableService = function (name) {
    const message = { name: 'disableService', serviceName: name };
    logger.log('disableService', message);
    void chrome.runtime.sendMessage(message);
};

const removeService = function (name) {
    const message = { name: 'removeService', serviceName: name };
    logger.log('removeService', message);
    void chrome.runtime.sendMessage(message);
};

const renameService = function (oldName, newName) {
    const message = { name: 'renameService', oldName, newName };
    logger.log('renameService', message);
    void chrome.runtime.sendMessage(message);
};

const saveService = function (settings) {
    const message = { name: 'saveService', settings };
    logger.log('saveService', message);
    void chrome.runtime.sendMessage(message);
};

const saveConfig = function (config) {
    const message = { name: 'saveConfig', config };
    logger.log('saveConfig', config);
    void chrome.runtime.sendMessage(message);
};

const setViews = function (viewConfig) {
    const message = { name: 'setViews', views: viewConfig };
    logger.log('setViews', message);
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
