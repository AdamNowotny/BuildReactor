define([
		'bamboo/buildService',
		'bamboo/bambooPlan',
		'bamboo/bambooRequest',
		'timer',
		'jquery',
		'signals',
		'jasmineSignals',
		'json!spec/fixtures/bamboo/projects.json'
	],
	function (BuildService, BambooPlan, BambooRequest, Timer, $, signals, jasmineSignals, projectsJson) {

		describe('bamboo/BuildService', function () {

			var service;
			var settings;
			var mockBambooRequestProjects;
			var mockBambooPlanUpdate;
			var mockTimer;
			var updateSuccessSignal;
			var updateErrorSignal;
			var spyOnSignal = jasmineSignals.spyOnSignal;
			
			beforeEach(function () {
				settings = {
					name: 'My Bamboo CI',
					username: null,
					password: null,
					url: 'http://example.com/',
					updateInterval: 10000,
					plans: ['PROJECT1-PLAN1', 'PROJECT2-PLAN2']
				};
				service = new BuildService(settings);
				mockBambooRequestProjects = spyOn(BambooRequest.prototype, 'projects').andCallFake(function () {
					this.responseReceived.dispatch(projectsJson);
				});
				mockBambooPlanUpdate = spyOn(BambooPlan.prototype, 'update').andCallFake(function () {
					var updateFinished = new signals.Signal();
					updateFinished.memorize = true;
					updateFinished.dispatch();
					return updateFinished;
				});
				mockTimer = spyOn(Timer.prototype, 'start');
				updateSuccessSignal = new signals.Signal();
				updateSuccessSignal.memorize = true;
				updateSuccessSignal.dispatch(true, {});
				updateErrorSignal = new signals.Signal();
				updateErrorSignal.memorize = true;
				updateErrorSignal.dispatch(false, { message: 'error message' });
			});

			it('should require service name', function () {
				expect(function () {
					var service = new BuildService({
						username: null,
						password: null,
						url: 'http://example.com/',
						updateInterval: 10000
					});
				}).toThrow();
			});

			it('should expose service interface', function () {
				expect(service.name).toBe(settings.name);
				expect(service.buildFailed).toBeDefined();
				expect(service.buildFixed).toBeDefined();
			});

			describe('initialize', function () {

				it('should initialize plans on start', function () {
					service.start();

					expect(mockBambooRequestProjects).toHaveBeenCalled();
					expect(service.isInitialized).toBe(true);
					expect(service.plans['PROJECT1-PLAN1']).toBeDefined();
					expect(service.plans['PROJECT2-PLAN2']).toBeDefined();
				});

				it('should re-initialize plans on restart', function () {
					service.start();
					expect(service.isInitialized).toBe(true);
					service.stop();
					expect(service.isInitialized).toBe(false);
					service.start();
					expect(service.isInitialized).toBe(true);

					expect(service.plans['PROJECT1-PLAN1']).toBeDefined();
					expect(service.plans['PROJECT2-PLAN2']).toBeDefined();
				});

				it('should signal error if initialization request failed', function () {
					var errorThrownSpy = spyOnSignal(service.errorThrown);
					mockBambooRequestProjects.andCallFake(function () {
						this.errorReceived.dispatch({ message: 'error message' });
					});

					service.start();

					expect(errorThrownSpy).toHaveBeenDispatched(1);
				});

				it('should signal error if initialization request parsing failed', function () {
					var errorThrownSpy = spyOnSignal(service.errorThrown);
					mockBambooRequestProjects.andCallFake(function () {
						this.errorReceived.dispatch({ message: 'error message' });
					});

					service.start();

					expect(errorThrownSpy).toHaveBeenDispatched(1);
				});

				it('should try again if initialize failed', function () {
					var attempt = 0;
					mockTimer.andCallFake(function () {
						if (attempt <= 1) {
							this.elapsed.dispatch();
						}
					});
					mockBambooRequestProjects.andCallFake(function () {
						attempt++;
						if (attempt <= 1) {
							this.errorReceived.dispatch({ message: 'ajax error' });
						} else {
							this.responseReceived.dispatch(projectsJson);
						}
					});
					var updateFinishedSpy = spyOnSignal(service.updateFinished);

					service.start();

					expect(updateFinishedSpy).toHaveBeenDispatched(2);
					expect(service.isInitialized).toBe(true);
					expect(mockBambooRequestProjects.callCount).toBe(2);
					expect(mockBambooPlanUpdate).toHaveBeenCalled();
					expect(mockTimer).toHaveBeenCalled();
				});

				it('should update after initialized', function () {
					service.start();

					expect(mockBambooPlanUpdate).toHaveBeenCalled();
				});

				it('should signal buildFailed when any build failed on first update', function () {
					var buildFailedSpy = spyOnSignal(service.buildFailed);
					mockBambooPlanUpdate.andCallFake(function () {
						this.buildFailed.dispatch(this);
						return updateSuccessSignal;
					});

					service.start();

					expect(buildFailedSpy).toHaveBeenDispatched(settings.plans.length);
				});

			});

			function initializeService() {
				service.initialize();
				service.isInitialized = true;
			}

			it('should not start if update interval not set', function () {
				var service1 = new BuildService({
					name: 'My Bamboo CI',
					username: null,
					password: null,
					url: 'http://example.com/'
				});

				expect(function () { service1.start(); }).toThrow();
			});

			it('should signal updateFinished when all plan updates finished', function () {
				initializeService();
				var updateFinishedSpy = spyOnSignal(service.updateFinished);
				mockBambooPlanUpdate.andReturn(updateSuccessSignal);

				service.update();

				expect(updateFinishedSpy).toHaveBeenDispatched(1);
			});

			it('should signal updateFinished when all plan updates finished with error', function () {
				initializeService();
				var updateFinishedSpy = spyOnSignal(service.updateFinished);
				mockBambooPlanUpdate.andReturn(updateErrorSignal);

				service.update();

				expect(updateFinishedSpy).toHaveBeenDispatched(1);
			});

			it('should not signal updateFinished when some plans still not finished', function () {
				initializeService();
				var updateFinishedSpy = spyOnSignal(service.updateFinished);
				var plansUpdated = 0;
				mockBambooPlanUpdate.andCallFake(function () {
					plansUpdated++;
					expect(updateFinishedSpy).not.toHaveBeenDispatched();
					return updateSuccessSignal;
				});

				service.update();

				expect(updateFinishedSpy).toHaveBeenDispatched(1);
			});

			it('should signal errorThrown if plan update failed', function () {
				initializeService();
				var errorThrownSpy = spyOnSignal(service.errorThrown);
				mockBambooPlanUpdate.andCallFake(function () {
					this.errorThrown.dispatch({ message: 'ajax error' });
					return updateErrorSignal;
				});

				service.update();

				expect(errorThrownSpy).toHaveBeenDispatched(settings.plans.length);
			});


			it('should update plans', function () {
				initializeService();

				service.update();

				expect(mockBambooPlanUpdate).toHaveBeenCalled();
			});

			it('should update until stopped', function () {
				mockTimer.andCallFake(function () {
					this.elapsed.dispatch();
				});
				var updateStartedSpy = spyOnSignal(service.updateStarted).matching(function () {
					if (this.count > 2) {
						service.stop();
						return false;
					}
					return true;
				});

				service.start();

				expect(updateStartedSpy).toHaveBeenDispatched(3);
			});

			it('multiple services should update independently', function () {
				initializeService();
				var service1 = new BuildService({ name: 'Bamboo', url: 'http://example1.com/', plans: [] });
				var updateStartedSpy1 = spyOnSignal(service1.updateStarted);
				var service2 = new BuildService({ name: 'Bamboo', url: 'http://example2.com/', plans: [] });
				var updateStartedSpy2 = spyOnSignal(service2.updateStarted);

				service1.update();
				service2.update();

				expect(updateStartedSpy1).toHaveBeenDispatched(1);
				expect(updateStartedSpy2).toHaveBeenDispatched(1);
			});

			it('should signal buildFailed if plan signaled', function () {
				initializeService();
				var buildFailedSpy = spyOnSignal(service.buildFailed);
				var plan = service.plans['PROJECT1-PLAN1'];

				plan.buildFailed.dispatch(plan);

				expect(buildFailedSpy).toHaveBeenDispatched(1);
			});

			it('should signal buildFixed if plan signaled', function () {
				initializeService();
				var buildFixedSpy = spyOnSignal(service.buildFixed);
				var plan = service.plans['PROJECT1-PLAN1'];

				plan.buildFixed.dispatch(plan);

				expect(buildFixedSpy).toHaveBeenDispatched(1);
			});

			it('should ignore disabled plans', function () {
				settings = {
					name: 'My Bamboo CI',
					url: 'http://example.com/',
					plans: ['PROJECT1-PLAN1', 'PROJECT1-PLAN2']
				};
				service = new BuildService(settings);

				service.update();

				expect(mockBambooPlanUpdate.callCount).toBe(1);
			});

		});
	});