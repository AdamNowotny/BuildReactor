define([
		'signals',
		'amdUtils/string/interpolate'
	], function (signals, interpolate) {
		var servicesStarted = new signals.Signal();
		var buildFailed = new signals.Signal();
		var buildFixed = new signals.Signal();
		var services = [];
		var settings = [];
		var failedCount = 0;
		var serviceAdded = new signals.Signal();
		var serviceRemoved = new signals.Signal();
		var servicesLoaded = new signals.Signal();
		var servicesToLoadCount = 0;

		function load(newSettings) {
			removeAllServices();
			settings = newSettings;
			servicesToLoadCount = settings.length;
			for (var i = 0; i < settings.length; i++) {
				loadService(settings[i]);
			}

			function loadService(serviceSettings) {
				var serviceName = interpolate('{{0}}/{{1}}', [serviceSettings.baseUrl, serviceSettings.service]);
				require([serviceName], function (Service) {
					var serviceInstance = new Service(serviceSettings);
					addService(serviceInstance);
					servicesToLoadCount--;
					if (servicesToLoadCount === 0) {
						servicesLoaded.dispatch();
					}
				});
			}

			function removeAllServices() {
				failedCount = 0;
				services.forEach(function (s) {
					unsubscribeFrom(s);
					serviceRemoved.dispatch(s);
				});
				services = [];
			}
		}

		function run() {
			if (servicesToLoadCount > 0) {
				servicesLoaded.addOnce(run);
				console.log('Waiting for ' + servicesToLoadCount + ' services to load');
				return;
			}
			services.forEach(function (s) {
				console.log('Service started: ' + s.name);
				s.start();
			});
			servicesStarted.dispatch(getCurrentState());
		}

		function addService(service) {
			Contract.expectString(service.name, 'service.name not defined');
			Contract.expectObject(service.buildFailed, 'service.buildFailed signal not defined');
			Contract.expectObject(service.buildFixed, 'service.buildFixed signal not defined');
			Contract.expectObject(service.updateStarted, 'service.buildFixed signal not defined');
			Contract.expectObject(service.updateFinished, 'service.buildFixed signal not defined');
			Contract.expectObject(service.errorThrown, 'service.buildFixed signal not defined');

			initializeServiceLogging(service);
			subscribeTo(service);
			services.push(service);
			console.log('Service added: ' + service.name, service.settings);
			serviceAdded.dispatch(service);
		}

		function removeService(service) {
			var index = services.indexOf(service);
			Contract.expect(index >= 0, 'Service not found');
			services.splice(index, 1);
			service.stop();
			unsubscribeFrom(service);
			serviceRemoved.dispatch(service);
		}

		function subscribeTo(service) {
			service.buildFailed.add(onBuildFailed);
			service.buildFixed.add(onBuildFixed);
		}

		function unsubscribeFrom(service) {
			service.updateStarted.removeAll();
			service.updateFinished.removeAll();
			service.buildFailed.removeAll();
			service.buildFixed.removeAll();
			service.errorThrown.removeAll();
		}

		function initializeServiceLogging(service) {
			service.updateStarted.add(function () {
				console.log(service.name + ': update started');
			});
			service.updateFinished.add(function () {
				console.log(service.name + ': update finished');
			});
			service.buildFailed.add(function (plan) {
				console.log(service.name + ': build failed', plan);
			});
			service.buildFixed.add(function (plan) {
				console.log(service.name + ': build fixed', plan);
			});
			service.errorThrown.add(function (errorInfo) {
				console.error(service.name + ': ' + errorInfo.message, errorInfo);
			});
		}

		function onBuildFailed(buildEvent) {
			failedCount++;
			buildFailed.dispatch({
				message: buildEvent.message,
				details: buildEvent.details,
				url: buildEvent.url,
				state: getCurrentState()
			});
		};

		function onBuildFixed(buildEvent) {
			failedCount--;
			buildFixed.dispatch({
				message: buildEvent.message,
				details: buildEvent.details,
				url: buildEvent.url,
				state: getCurrentState()
			});
		}

		function getCurrentState() {
			return {
				failedBuildsCount: failedCount
			};
		}

		return {
			load: load,
			servicesStarted: servicesStarted,
			buildFailed: buildFailed,
			buildFixed: buildFixed,
			addService: addService,
			removeService: removeService,
			services: services,
			run: run
		};
	});
