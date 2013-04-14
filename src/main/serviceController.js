define([
		'main/serviceRepository',
		'signals'
	], function (serviceRepository, signals) {

		'use strict';

		var on = {
			reloading: new signals.Signal(),
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
				serviceRepository.create(serviceInfo).addOnce(function (service) {
					addService(service);
					servicesToLoadCount--;
					if (servicesToLoadCount === 0) {
						loadedAll.dispatch();
					}
				});
			}

			on.reloading.dispatch();
			var loadedAll = new signals.Signal();
			loadedAll.memorize = true;
			removeAllServices();
			servicesToLoadCount = settings.length;
			settings.filter(function (s) {
				if (s.disabled) {
					servicesToLoadCount--;
				}
				return !s.disabled;
			}).forEach(function (s) {
				loadService(s);
			});
			if (servicesToLoadCount === 0) {
				loadedAll.dispatch();
			}
			return loadedAll;
		}

		function run() {

			function serviceStarted(service) {
				on.started.dispatch(service.settings);
				toInitializeCount--;
				if (toInitializeCount === 0) {
					on.startedAll.dispatch();
				}
			}

			if (services.length === 0) {
				on.startedAll.dispatch();
			}
			var toInitializeCount = services.length;
			services.forEach(function (s) {
				if (s.rx) {
					s.start().subscribe(function (_) {
						serviceStarted(s);
					});
				} else {
					s.start();
					s.on.updated.addOnce(function () {
						serviceStarted(s);
					});
				}
			});
		}

		function activeProjects() {
			var projects = services.map(function (s) {
				return s.activeProjects();
			});
			return projects;
		}

		function addService(service) {
			if (!service.settings) {
				throw { name: 'ArgumentInvalid', message: 'service.settings not defined' };
			}
			if (service.rx) {
				rxSubscribeTo(service);
			} else {
				subscribeTo(service);
			}
			services.push(service);
			on.added.dispatch(service.settings);
		}

		function removeService(service) {
			var index = services.indexOf(service);
			if (index < 0) {
				throw { name: 'NotFound', message: 'Service not found' };
			}
			services.splice(index, 1);
			service.stop();
			if (!service.rx) {
				unsubscribeFrom(service);
			}
		}

		function removeAllServices() {
			services.forEach(function (s) {
				if (s.rx) {
					rxUnsubscribeFrom(s);
				} else {
					unsubscribeFrom(s);
				}
			});
			services = [];
		}

		function rxSubscribeTo(service) {

		}

		function rxUnsubscribeFrom(service) {

		}

		function subscribeTo(service) {
			service.on.updating.add(function () {
				on.updating.dispatch(service.settings);
			});
			service.on.updated.add(function () {
				on.updated.dispatch(service.settings);
			});
			service.on.errorThrown.add(function (build) {
				on.errorThrown.dispatch(build);
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
