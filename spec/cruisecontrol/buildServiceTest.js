define([
		'src/cruisecontrol/buildService',
		'src/cruisecontrol/projectFactory',
		'src/cruisecontrol/ccRequest',
		'src/timer',
		'jquery',
		'signals',
		'jasmineSignals',
		'text!spec/fixtures/cruisecontrol/cruisecontrolnet.xml',
        'xml2json'
],
	function (BuildService, projectFactory, ccRequest, Timer, $, signals, jasmineSignals, projectsXml) {

	    describe('cruisecontrol/buildService', function () {

	        var service;
	        var settings;
	        var mockRequest;
	        var mockTimer;
	        var spyOnSignal = jasmineSignals.spyOnSignal;
	        var projectsJson;
	        
	        var responseReceived;
	        var errorReceived;

	        beforeEach(function () {
	            projectsJson = $.xml2json(projectsXml);
	            responseReceived = new signals.Signal();
	            responseReceived.memorize = true;
	            errorReceived = new signals.Signal();
	            errorReceived.memorize = true;
	            settings = {
	                name: 'My Bamboo CI',
	                username: null,
	                password: null,
	                url: 'http://example.com/',
	                updateInterval: 10000,
	                projects: ['CruiseControl.NET', 'NetReflector']
	            };
	            service = new BuildService(settings);
	            mockRequest = spyOn(ccRequest, 'projects');
	            initResponse();
	            mockTimer = spyOn(Timer.prototype, 'start');
	            spyOn(projectFactory, 'create').andReturn({
	                name: 'CruiseControl.NET',
	                buildFailed: new signals.Signal(),
	                buildFixed: new signals.Signal(),
	                update: function() {
	                }
	            });
	        });

	        var initResponse = function() {
	            mockRequest.andCallFake(function() {
	                responseReceived.dispatch(projectsJson);
	                return {
	                    responseReceived: responseReceived,
	                    errorReceived: errorReceived
	                };
	            });
	        };
	        
	        var initErrorResponse = function() {
	            mockRequest.andCallFake(function() {
	                errorReceived.dispatch({ message: 'ajax error' });
	                return {
	                    responseReceived: responseReceived,
	                    errorReceived: errorReceived
	                };
	            });
	        };
	        
	        it('should require service name', function () {
	            expect(function () {
	                var service = new BuildService({
	                    name: null,
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

	        it('should get projects state on start', function () {
	            service.start();

	            expect(mockRequest).toHaveBeenCalled();
	            expect(service.projects['CruiseControl.NET']).toBeDefined();
	            expect(service.projects['NetReflector']).toBeDefined();
	        });

	        it('should only update projects on subsequent calls', function () {
	            service.update();
	            projectFactory.create.reset();

	            service.update();
	            
	            expect(projectFactory.create).not.toHaveBeenCalled();
            });
	        
	        it('should try again if request failed', function () {
	            // TODO: this looks ugly, time for a mock builder ?
	            var attempt = 0;
	            mockTimer.andCallFake(function () {
	                if (attempt <= 1) {
	                    this.elapsed.dispatch();
	                }
	            });
	            mockRequest.andCallFake(function () {
	                attempt++;
	                responseReceived = new signals.Signal();
	                responseReceived.memorize = true;
	                errorReceived = new signals.Signal();
	                errorReceived.memorize = true;
	                if (attempt <= 1) {
	                    errorReceived.dispatch({ message: 'ajax error' });
	                } else {
	                    responseReceived.dispatch(projectsJson);
                    }
	                return {
	                    responseReceived: responseReceived,
	                    errorReceived: errorReceived
	                };
	            });
	            var updateFinishedSpy = spyOnSignal(service.updateFinished);

	            service.start();

	            expect(updateFinishedSpy).toHaveBeenDispatched(2);
	            expect(mockRequest.callCount).toBe(2);
	            expect(mockTimer).toHaveBeenCalled();
	        });

	        it('should not start if update interval not set', function () {
	            var service1 = new BuildService({
	                name: 'My Bamboo CI',
	                updateInterval: undefined,
	                url: 'http://example.com/'
	            });

	            expect(function () { service1.start(); }).toThrow();
	        });

	        it('should signal updateFinished when update finished', function () {
	            var updateFinishedSpy = spyOnSignal(service.updateFinished);

	            service.update();

	            expect(updateFinishedSpy).toHaveBeenDispatched(1);
	        });

	        it('should signal updateFinished when finished with error', function () {
	            var updateFinishedSpy = spyOnSignal(service.updateFinished);
	            initErrorResponse();

	            service.update();

	            expect(updateFinishedSpy).toHaveBeenDispatched(1);
	        });

	        it('should signal errorThrown when update failed', function () {
	            var errorThrownSpy = spyOnSignal(service.errorThrown);
	            initErrorResponse();

	            service.update();

	            expect(errorThrownSpy).toHaveBeenDispatched();
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
	            var service1 = new BuildService({ name: 'Bamboo', url: 'http://example1.com/', projects: [] });
	            var updateStartedSpy1 = spyOnSignal(service1.updateStarted);
	            var service2 = new BuildService({ name: 'Bamboo', url: 'http://example2.com/', projects: [] });
	            var updateStartedSpy2 = spyOnSignal(service2.updateStarted);

	            service1.update();
	            service2.update();

	            expect(updateStartedSpy1).toHaveBeenDispatched(1);
	            expect(updateStartedSpy2).toHaveBeenDispatched(1);
	        });

	        it('should signal buildFailed if project signaled', function () {
	            var buildFailedSpy = spyOnSignal(service.buildFailed).matching(function (info) {
	                return info.message === 'Build failed - CruiseControl.NET';
	            });
	            initResponse();
	            service.update();
	            var failedProject = service.projects['CruiseControl.NET'];

	            failedProject.buildFailed.dispatch(failedProject);

	            expect(buildFailedSpy).toHaveBeenDispatched(1);
	        });

	        it('should signal buildFixed if project signaled', function () {
	            var buildFixedSpy = spyOnSignal(service.buildFixed).matching(function (info) {
	                return info.message === 'Build fixed - CruiseControl.NET';
	            });;
	            initResponse();
	            service.update();
	            var fixedProject = service.projects['CruiseControl.NET'];

	            fixedProject.buildFixed.dispatch(fixedProject);

	            expect(buildFixedSpy).toHaveBeenDispatched(1);
	        });

	        it('should ignore plans that are not monitored', function() {
	            service.update();

	            expect(service.projects['FastForward.NET']).not.toBeDefined();
	        });

	    });
	});