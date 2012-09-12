define([
		'signals'
	], function (signals) {

		'use strict';

		var on = {
			reset: new signals.Signal(),
			added: new signals.Signal(),
			updating: new signals.Signal(),
			updated: new signals.Signal(),
			brokenBuild: new signals.Signal(),
			fixedBuild: new signals.Signal(),
			started: new signals.Signal(),
			startedAll: new signals.Signal(),
			errorThrown: new signals.Signal()
		};

		var services = [];
		
		var servicesToLoadCount = 0;

		function load(settings) {
			
			function loadService(serviceInfo) {
				var serviceName = serviceInfo.baseUrl + '/buildService';
				require([serviceName], function (Service) {
					var serviceInstance = new Service(serviceInfo);
					addService(serviceInstance);
					servicesToLoadCount--;
					if (servicesToLoadCount === 0) {
						loadedAll.dispatch();
					}
				});
			}

			var loadedAll = new signals.Signal();
			loadedAll.memorize = true;
			removeAllServices();
			servicesToLoadCount = settings.length;
			if (settings.length === 0) {
				loadedAll.dispatch();
			} else {
				settings.forEach(function (settingsItem) {
					loadService(settingsItem);
				});
			}
			return loadedAll;
		}

		function run() {
			if (services.length === 0) {
				on.startedAll.dispatch();
			}
			var toInitializeCount = services.length;
			services.forEach(function (s) {
				s.start();
				s.on.updated.addOnce(function () {
					on.started.dispatch({ serviceName: s.name });
					toInitializeCount--;
					if (toInitializeCount === 0) {
						on.startedAll.dispatch();
					}
				});
			});
		}

		function activeProjects() {
			var projects = services.map(function (s) {
				return s.activeProjects();
			});
			return projects;
		}

		function addService(service) {
			if (!service.name) {
				throw { name: 'ArgumentInvalid', message: 'service.name not defined' };
			}
			subscribeTo(service);
			services.push(service);
			on.added.dispatch(service);
		}

		function removeService(service) {
			var index = services.indexOf(service);
			if (index < 0) {
				throw { name: 'NotFound', message: 'Service not found' };
			}
			services.splice(index, 1);
			service.stop();
			unsubscribeFrom(service);
		}

		function removeAllServices() {
			services.forEach(function (s) {
				unsubscribeFrom(s);
			});
			services = [];
			on.reset.dispatch();
		}

		function subscribeTo(service) {
			service.on.updating.add(function () {
				on.updating.dispatch({ serviceName: service.name });
			});
			service.on.updated.add(function () {
				on.updated.dispatch({ serviceName: service.name });
			});
			service.on.errorThrown.add(function (errorInfo) {
				on.errorThrown.dispatch(errorInfo);
			});
			service.on.brokenBuild.add(function (buildEvent) {
				on.brokenBuild.dispatch(buildEvent);
			});
			service.on.fixedBuild.add(function (buildEvent) {
				on.fixedBuild.dispatch(buildEvent);
			});
		}

		function unsubscribeFrom(service) {
			service.on.updating.removeAll();
			service.on.updated.removeAll();
			service.on.brokenBuild.removeAll();
			service.on.fixedBuild.removeAll();
			service.on.errorThrown.removeAll();
		}

		return {
			load: load,
			on: on,
			addService: addService,
			removeService: removeService,
			services: services,
			run: run,
			activeProjects: activeProjects
		};
	});
