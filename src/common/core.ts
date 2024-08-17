/// <reference types="chrome"/>
import 'rx/dist/rx.binding';
import Rx from 'rx';
import logger from './logger';
import testActiveProjects from './__mocks__/core.mock.activeProjects';
import testViews from './__mocks__/core.mock.views';
import testConfigurations from './__mocks__/core.mock.configurations';

const init = function ({ test = false }) {
    if (test) {
        activeProjects.onNext(testActiveProjects);
        configurations.onNext(testConfigurations);
        views.onNext(testViews);
        return;
    }
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
    logger.info('availableServices', message);
    chrome.runtime.sendMessage(message, callback);
};

const availableProjects = function (settings, callback) {
    const message = { name: 'availableProjects', serviceSettings: settings };
    logger.info('availableProjects', message);
    chrome.runtime.sendMessage(message, callback);
};

const setOrder = function (serviceNames) {
    const message = { name: 'setOrder', order: serviceNames };
    logger.info('setOrder', message);
    void chrome.runtime.sendMessage(message);
};

const setBuildOrder = function (serviceName, builds) {
    const message = { name: 'setBuildOrder', serviceName, order: builds };
    logger.info('setBuildOrder', message);
    void chrome.runtime.sendMessage(message);
};

const enableService = function (name) {
    const message = { name: 'enableService', serviceName: name };
    logger.info('enableService', message);
    void chrome.runtime.sendMessage(message);
};

const disableService = function (name) {
    const message = { name: 'disableService', serviceName: name };
    logger.info('disableService', message);
    void chrome.runtime.sendMessage(message);
};

const removeService = function (name) {
    const message = { name: 'removeService', serviceName: name };
    logger.info('removeService', message);
    void chrome.runtime.sendMessage(message);
};

const renameService = function (oldName, newName) {
    const message = { name: 'renameService', oldName, newName };
    logger.info('renameService', message);
    void chrome.runtime.sendMessage(message);
};

const saveService = function (settings) {
    const message = { name: 'saveService', settings };
    logger.info('saveService', message);
    void chrome.runtime.sendMessage(message);
};

const saveConfig = function (config) {
    const message = { name: 'saveConfig', config };
    logger.info('saveConfig', config);
    void chrome.runtime.sendMessage(message);
};

const setViews = function (viewConfig) {
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
