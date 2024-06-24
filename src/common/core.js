import 'rx/dist/rx.binding';
import Rx from 'rx';
import chromeApi from 'common/chromeApi';
import logger from './logger';

const init = function() {
	const statePort = chromeApi.connect({ name: 'state' });
	statePort.onMessage.addListener(function(message) {
		activeProjects.onNext(message);
	});
	const configPort = chromeApi.connect({ name: 'configuration' });
	configPort.onMessage.addListener(function(message) {
		configurations.onNext(message);
	});
	const viewConfigPort = chromeApi.connect({ name: 'views' });
	viewConfigPort.onMessage.addListener(function(message) {
		views.onNext(message);
	});
};

const activeProjects = new Rx.ReplaySubject(1);
const configurations = new Rx.ReplaySubject(1);
const views = new Rx.ReplaySubject(1);

const availableServices = function(callback) {
	const message = { name: 'availableServices' };
	logger.log('availableServices', message);
	chromeApi.sendMessage(message, callback);
};

const availableProjects = function(settings, callback) {
	const message = { name: 'availableProjects', serviceSettings: settings };
	logger.log('availableProjects', message);
	chromeApi.sendMessage(message, function(response) {
		logger.log('availableProjects', { response, serviceSettings: settings });
		callback(response);
	});
};

const setOrder = function(serviceNames) {
	const message = { name: 'setOrder', order: serviceNames };
	logger.log('setOrder', message);
	chromeApi.sendMessage(message);
};

const setBuildOrder = function(serviceName, builds) {
	const message = { name: 'setBuildOrder', serviceName, order: builds };
	logger.log('setBuildOrder', message);
	chromeApi.sendMessage(message);
};

const enableService = function(name) {
	const message = { name: 'enableService', serviceName: name };
	logger.log('enableService', message);
	chromeApi.sendMessage(message);
};

const disableService = function(name) {
	const message = { name: 'disableService', serviceName: name };
	logger.log('disableService', message);
	chromeApi.sendMessage(message);
};

const removeService = function(name) {
	const message = { name: 'removeService', serviceName: name };
	logger.log('removeService', message);
	chromeApi.sendMessage(message);
};

const renameService = function(oldName, newName) {
	const message = { name: 'renameService', oldName, newName };
	logger.log('renameService', message);
	chromeApi.sendMessage(message);
};

const saveService = function(settings) {
	const message = { name: 'saveService', settings };
	messages.onNext(message);
	chromeApi.sendMessage(message);
};

const saveConfig = function(config) {
	const message = { name: 'saveConfig', config };
	messages.onNext(message);
	chromeApi.sendMessage(message);
};

const setViews = function(viewConfig) {
	const message = { name: 'setViews', views: viewConfig };
	messages.onNext(message);
	chromeApi.sendMessage(message);
};

export default {
	init,
	availableServices,
	configurations,
	views,
	activeProjects,
	setOrder,
	setBuildOrder,
	availableProjects,
	enableService,
	disableService,
	removeService,
	renameService,
	saveService,
	saveConfig,
	setViews,
};
