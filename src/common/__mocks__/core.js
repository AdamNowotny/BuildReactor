import availableServicesResponse from './core.mock.availableServices.js';
import activeProjectsResponse from './core.mock.activeProjects.js';
import availableProjectsResponse from './core.mock.availableProjects.js';
import configurations from './core.mock.configurations.js';
import views from './core.mock.views.js';
import Rx from 'rx';
import 'rx.time';

var messages = new Rx.ReplaySubject(1);

var availableServices = function (callback) {
    callback(availableServicesResponse);
};

var availableProjects = function (settings, callback) {
    callback(availableProjectsResponse);
};

var log = function (parameters) {
    messages.onNext(parameters);
};

return {
    init: function () {},
    availableServices: availableServices,
    configurations: configurations,
    views: views,
    activeProjects: Rx.Observable.return(activeProjectsResponse),
    availableProjects: availableProjects,
    enableService: log,
    disableService: log,
    removeService: log,
    renameService: log,
    setOrder: log,
    messages: messages,
};
