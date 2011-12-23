define([
		'jquery',
		'src/serviceController',
		'mocks/mockBuildServiceBuilder',
		'mocks/mockBuildEventBuilder',
		'mocks/mockSettingsBuilder',
		'SignalLogger'],
	function ($, controller, MockBuildServiceBuilder, MockBuildEventBuilder, MockSettingsBuilder, SignalLogger) {

	    describe('ServiceController', function () {

	        var logger;

	        beforeEach(function () {
	            controller.load([]);
	            logger = new SignalLogger({
	                servicesStarted: controller.servicesStarted,
	                buildFailed: controller.buildFailed,
	                buildFixed: controller.buildFixed
	            });
	            logger.reset();
	        });

	        it('should require service interface', function () {
	            var mockNoName = new MockBuildServiceBuilder().withNoName().create();
	            var mockNoBuildFailed = new MockBuildServiceBuilder().withNoBuildFixedSignal().create();
	            var mockNoBuildFixed = new MockBuildServiceBuilder().withNoBuildFixedSignal().create();
	            var mockNoUpdateStarted = new MockBuildServiceBuilder().withNoUpdateFinishedSignal().create();
	            var mockNoUpdateFinished = new MockBuildServiceBuilder().withNoUpdateStartedSignal().create();
	            var mockNoErrorThrown = new MockBuildServiceBuilder().withNoErrorThrownSignal().create();

	            expect(function () { controller.addService(mockNoName); }).toThrow();
	            expect(function () { controller.addService(mockNoBuildFailed); }).toThrow();
	            expect(function () { controller.addService(mockNoBuildFixed); }).toThrow();
	            expect(function () { controller.addService(mockNoUpdateStarted); }).toThrow();
	            expect(function () { controller.addService(mockNoUpdateFinished); }).toThrow();
	            expect(function () { controller.addService(mockNoErrorThrown); }).toThrow();
	        });

	        it('should throw exception if removing service that has not been added', function () {
	            var mockService = new MockBuildServiceBuilder().create();

	            expect(function () { controller.removeService(mockService); }).toThrow();
	        });

	        it('should stop on service removed', function () {
	            var mockService = new MockBuildServiceBuilder().create();
	            spyOn(mockService, 'stop');

	            controller.addService(mockService);
	            controller.removeService(mockService);

	            expect(mockService.stop).toHaveBeenCalled();
	        });

	        it('should unsubscribe from signals on service removed', function () {
	            var mockService = new MockBuildServiceBuilder().create();

	            controller.addService(mockService);
	            controller.removeService(mockService);

	            expect(mockService.buildFailed.getNumListeners()).toBe(0);
	            expect(mockService.buildFixed.getNumListeners()).toBe(0);
	            expect(mockService.updateFinished.getNumListeners()).toBe(0);
	            expect(mockService.updateStarted.getNumListeners()).toBe(0);
	            expect(mockService.errorThrown.getNumListeners()).toBe(0);
	        });

	        it('should remove all services when empty settings passed', function () {
	            var mockService1 = new MockBuildServiceBuilder().create();
	            var mockService2 = new MockBuildServiceBuilder().create();
	            controller.addService(mockService1);
	            controller.addService(mockService2);

	            controller.load([]);

	            expect(controller.services.length).toBe(0);
	        });

	        it('should start all services', function () {
	            var mockService1 = new MockBuildServiceBuilder().create();
	            var mockService2 = new MockBuildServiceBuilder().create();
	            spyOn(mockService1, 'start');
	            spyOn(mockService2, 'start');
	            controller.addService(mockService1);
	            controller.addService(mockService2);

	            controller.run();

	            expect(mockService1.start).toHaveBeenCalled();
	            expect(mockService2.start).toHaveBeenCalled();
	        });

	        it('should signal buildFailed on build failure', function () {
	            var mockService = new MockBuildServiceBuilder().create();
	            controller.addService(mockService);

	            var buildEvent = new MockBuildEventBuilder().withFailedBuilds(1).create();
	            mockService.buildFailed.dispatch(buildEvent);

	            expect(logger.buildFailed.count).toBe(1);
	        });

	        it('should signal buildFixed on build fixed event', function () {
	            var mockService = new MockBuildServiceBuilder().create();
	            controller.addService(mockService);

	            var buildEvent = new MockBuildEventBuilder().withFailedBuilds(0).create();
	            mockService.buildFixed.dispatch(buildEvent);

	            expect(logger.buildFixed.count).toBe(1);
	        });

	        it('should update state on build failure', function () {
	            var mockService = new MockBuildServiceBuilder().create();
	            controller.addService(mockService);

	            var buildEvent = new MockBuildEventBuilder().withFailedBuilds(1).create();
	            mockService.buildFailed.dispatch(buildEvent);

	            expect(logger.buildFailed.lastCallParams.state.failedBuildsCount).toBe(1);
	        });

	        it('should update state on build fixed event', function () {
	            var mockService = new MockBuildServiceBuilder().create();
	            controller.addService(mockService);

	            var buildEvent = new MockBuildEventBuilder().create();
	            mockService.buildFailed.dispatch(buildEvent);
	            mockService.buildFailed.dispatch(buildEvent);
	            mockService.buildFixed.dispatch(buildEvent);

	            expect(logger.buildFixed.lastCallParams.state.failedBuildsCount).toBe(1);
	        });

	        it('should run services only after all are loaded', function () {
	            var settings1 = new MockSettingsBuilder().withName('service 1').withService('service1').create();
	            var settings2 = new MockSettingsBuilder().withName('service 2').withService('service2').create();
	            var Service1 = new MockBuildServiceBuilder().fromSettings(settings1).createConstructor();
	            var Service2 = new MockBuildServiceBuilder().fromSettings(settings2).createConstructor();
	            var loaded1callback;
	            var loaded2callback;
	            spyOn(window, 'require').andCallFake(function (serviceNames, callback) {
	                switch (serviceNames[0]) {
	                    case 'service1':
	                        loaded1callback = callback;
	                        break;
	                    case 'service2':
	                        loaded2callback = callback;
	                        break;
	                    default:
	                        throw 'Service unknown: ' + serviceNames[0];
	                }
	            });

	            controller.load([settings1, settings2]);
	            controller.run();

	            expect(logger.servicesStarted.count).toBe(0);
	            loaded1callback(Service1);
	            expect(logger.servicesStarted.count).toBe(0);
	            loaded2callback(Service2);
	            expect(logger.servicesStarted.count).toBe(1);
	        });

	        it('should reset state on load', function () {
	            var settings = new MockSettingsBuilder().create();
	            var mockService = new MockBuildServiceBuilder().create();
	            controller.addService(mockService);
	            var buildEvent = new MockBuildEventBuilder().withFailedBuilds(1).create();
	            mockService.buildFailed.dispatch(buildEvent);

	            expect(logger.buildFailed.lastCallParams.state.failedBuildsCount).toBe(1);
	            controller.load([settings]);
	            controller.addService(mockService);
	            mockService.buildFailed.dispatch(buildEvent);

	            expect(logger.buildFailed.lastCallParams.state.failedBuildsCount).toBe(1);
	        });



	    });
	});