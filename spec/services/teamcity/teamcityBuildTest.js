define([
	'services/teamcity/teamcityBuild',
	'services/teamcity/teamcityRequest',
	'signals',
	'jasmineSignals'
], function (Build, request, Signal, spyOnSignal) {
	'use strict';

	describe('services/teamcity/teamcityBuild', function () {

		var build;
		var settings;
		var buildJson;
		var buildRunningJson;
		var mockRequestBuild;
		var mockRequestBuildRunning;

		beforeEach(function () {
			settings = {};
			buildJson = JSON.parse(readFixtures('teamcity/build.json'));
			buildRunningJson = JSON.parse(readFixtures('teamcity/buildRunning.json'));
			mockRequestBuild = spyOn(request, 'build').andReturn(createResult({ response: buildJson }));
			mockRequestBuildRunning = spyOn(request, 'buildRunning').andReturn(createResult({ response: {} }));
			build = new Build('build_id', settings);
			spyOnSignal(build.on.broken);
			spyOnSignal(build.on.fixed);
			spyOnSignal(build.on.started);
			spyOnSignal(build.on.finished);
			spyOnSignal(build.on.errorThrown);
		});

		function createResult(response) {
			var completed = new Signal();
			completed.memorize = true;
			if (response) {
				completed.dispatch(response);
			}
			return completed;
		}

		describe('build', function () {

			it('should make request on update', function () {
				build.update();

				expect(request.build).toHaveBeenCalledWith(settings, 'build_id');
			});

			it('should signal when update completed', function () {
				var completed = false;
				mockRequestBuild.andCallFake(function () {
					expect(completed).toBe(false);
					return createResult({ response: buildJson });
				});

				build.update().addOnce(function () {
					completed = true;
				});

				expect(completed).toBe(true);
			});

			it('should initialize on update', function () {
				build.update();

				expect(build.name).toBe('Build');
				expect(build.projectName).toBe('Amazon API client');
				expect(build.webUrl).toBe('http://teamcity.jetbrains.com/viewLog.html?buildId=63887&buildTypeId=bt297');
				expect(build.isBroken).toBe(false);
			});

			describe('broken', function () {

				it('should signal if broken', function () {
					mockRequestBuild.andCallFake(function () {
						buildJson.status = 'FAILURE';
						return createResult({ response: buildJson });
					});

					build.update();

					expect(build.isBroken).toBe(true);
					expect(build.on.broken).toHaveBeenDispatchedWith(build);
				});

				it('should not signal if still broken', function () {
					mockRequestBuild.andCallFake(function () {
						buildJson.status = 'FAILURE';
						return createResult({ response: buildJson });
					});
					build.isBroken = true;

					build.update();

					expect(build.isBroken).toBe(true);
					expect(build.on.broken).not.toHaveBeenDispatched();
				});

				it('should signal if broken with error', function () {
					mockRequestBuild.andCallFake(function () {
						buildJson.status = 'ERROR';
						return createResult({ response: buildJson });
					});

					build.update();

					expect(build.isBroken).toBe(true);
					expect(build.on.broken).toHaveBeenDispatchedWith(build);
				});

				it('should not signal if still broken with error', function () {
					mockRequestBuild.andCallFake(function () {
						buildJson.status = 'ERROR';
						return createResult({ response: buildJson });
					});
					build.isBroken = true;

					build.update();

					expect(build.isBroken).toBe(true);
					expect(build.on.broken).not.toHaveBeenDispatched();
				});

			});

			describe('fixed', function () {

				it('should signal when fixed', function () {
					mockRequestBuild.andCallFake(function () {
						buildJson.status = 'SUCCESS';
						return createResult({ response: buildJson });
					});
					build.isBroken = true;

					build.update();

					expect(build.isBroken).toBe(false);
					expect(build.on.fixed).toHaveBeenDispatchedWith(build);
				});

				it('should not signal fixed if not broken', function () {
					mockRequestBuild.andCallFake(function () {
						buildJson.status = 'SUCCESS';
						return createResult({ response: buildJson });
					});
					build.isBroken = false;

					build.update();

					expect(build.isBroken).toBe(false);
					expect(build.on.fixed).not.toHaveBeenDispatched();
				});

			});

			it('should only signal errorThrown on failure', function () {
				var errorInfo = { httpStatus: 123 };
				mockRequestBuild.andReturn(createResult({ error: errorInfo }));
				mockRequestBuildRunning.andReturn(createResult({ error: errorInfo }));

				build.update();

				expect(build.on.errorThrown).toHaveBeenDispatchedWith(build);
				expect(build.on.broken).not.toHaveBeenDispatched();
				expect(build.on.fixed).not.toHaveBeenDispatched();
				expect(build.on.started).not.toHaveBeenDispatched();
				expect(build.on.finished).not.toHaveBeenDispatched();
			});

			it('should not make further calls on failure', function () {
				var errorInfo = { httpStatus: 123 };
				mockRequestBuild.andReturn(createResult({ error: errorInfo }));

				build.update();

				expect(mockRequestBuildRunning).not.toHaveBeenCalled();
			});

		});

		describe('buildRunning', function () {

			it('should signal when started', function () {
				mockRequestBuildRunning.andReturn(createResult({ response: buildRunningJson }));
				build.isRunning = false;

				build.update();

				expect(build.isRunning).toBe(true);
				expect(build.on.started).toHaveBeenDispatchedWith(build);
			});

			it('should signal finished if no running builds found', function () {
				mockRequestBuildRunning.andReturn(createResult({ response: buildJson }));
				build.isRunning = true;

				build.update();

				expect(build.isRunning).toBe(false);
				expect(build.on.finished).toHaveBeenDispatchedWith(build);
			});

			it('should not signal finished if still stopped', function () {
				mockRequestBuildRunning.andReturn(createResult({ response: buildJson }));
				build.isRunning = false;

				build.update();

				expect(build.isRunning).toBe(false);
				expect(build.on.finished).not.toHaveBeenDispatched();
			});

			it('should signal only errorThrown on ajax failure', function () {
				var errorInfo = { httpStatus: 123 };
				mockRequestBuildRunning.andReturn(createResult({ error: errorInfo }));

				build.update();

				expect(build.on.errorThrown).toHaveBeenDispatchedWith(build);
				expect(build.on.started).not.toHaveBeenDispatched();
				expect(build.on.finished).not.toHaveBeenDispatched();
			});
		});

	});
});