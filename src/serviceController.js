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
			loadedAll: new signals.Signal(),
			errorThrown: new signals.Signal()
		};

		var services = [];
		var settings = [];
		var servicesToLoadCount = 0;

		function load(newSettings) {
			
			function loadService(serviceSettings) {
				var serviceName = serviceSettings.baseUrl + '/buildService';
				require([serviceName], function (Service) {
					var serviceInstance = new Service(serviceSettings);
					addService(serviceInstance);
					servicesToLoadCount--;
					if (servicesToLoadCount === 0) {
						on.loadedAll.dispatch();
					}
				});
			}

			function removeAllServices() {
				services.forEach(function (s) {
					unsubscribeFrom(s);
				});
				services = [];
			}

			on.reset.dispatch();
			removeAllServices();
			settings = newSettings;
			servicesToLoadCount = settings.length;
			for (var i = 0; i < settings.length; i++) {
				loadService(settings[i]);
			}

		}

		function run() {
			if (servicesToLoadCount > 0) {
				on.loadedAll.addOnce(run);
				return;
			}
			services.forEach(function (s) {
				on.started.dispatch({ serviceName: s.name });
				s.start();
			});
			on.startedAll.dispatch();
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
			run: run
		};
	});
