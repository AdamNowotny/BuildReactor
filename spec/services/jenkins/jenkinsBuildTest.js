define([
	'services/jenkins/jenkinsBuild',
	'services/jenkins/jenkinsRequest',
	'signals',
	'jasmineSignals'
], function (Build, request, Signal, spyOnSignal) {
	'use strict';

	describe('services/jenkins/jenkinsBuild', function () {

		var build;
		var settings;
		var buildJson;
		var buildCompletedJson;
		var mockRequestBuild;
		var mockRequestBuildCompleted;

		beforeEach(function () {
			settings = {};
			buildJson = JSON.parse(readFixtures('jenkins/lastBuild.json'));
			buildCompletedJson = JSON.parse(readFixtures('jenkins/lastCompletedBuild.json'));
			mockRequestBuild = spyOn(request, 'lastBuild').andReturn(createResult({ response: buildJson }));
			mockRequestBuildCompleted = spyOn(request, 'lastCompletedBuild')
				.andReturn(createResult({ response: buildCompletedJson }));
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

		it('should make request on update', function () {
			build.update();

			expect(request.lastBuild).toHaveBeenCalledWith(settings, 'build_id');
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

			expect(build.name).toBe('build_id');
			expect(build.projectName).toBe(null);
			expect(build.webUrl).toBe('http://ci.jenkins-ci.org/job/config-provider-model/1036/');
			expect(build.isBroken).toBe(false);
		});

		describe('broken', function () {

			it('should signal on failure', function () {
				buildJson.result = 'FAILURE';

				build.update();

				expect(build.isBroken).toBe(true);
				expect(build.on.broken).toHaveBeenDispatchedWith(build);
			});

			it('should not signal if still broken', function () {
				buildJson.result = 'FAILURE';
				build.isBroken = true;

				build.update();

				expect(build.isBroken).toBe(true);
				expect(build.on.broken).not.toHaveBeenDispatched();
			});

			it('should signal if unstable', function () {
				buildJson.result = 'UNSTABLE';

				build.update();

				expect(build.isBroken).toBe(true);
				expect(build.on.broken).toHaveBeenDispatchedWith(build);
			});

			it('should signal if not build', function () {
				buildJson.result = 'NOT_BUILT';

				build.update();

				expect(build.isBroken).toBe(true);
				expect(build.on.broken).toHaveBeenDispatchedWith(build);
			});

			it('should signal if aborted', function () {
				buildJson.result = 'ABORTED';

				build.update();

				expect(build.isBroken).toBe(true);
				expect(build.on.broken).toHaveBeenDispatchedWith(build);
			});

		});

		describe('fixed', function () {

			it('should signal when fixed', function () {
				buildJson.result = 'SUCCESS';
				build.isBroken = true;

				build.update();

				expect(build.isBroken).toBe(false);
				expect(build.on.fixed).toHaveBeenDispatchedWith(build);
			});

			it('should not signal fixed if not broken', function () {
				buildJson.result = 'SUCCESS';
				build.isBroken = false;

				build.update();

				expect(build.isBroken).toBe(false);
				expect(build.on.fixed).not.toHaveBeenDispatched();
			});

		});

		describe('running', function () {

			beforeEach(function () {
				buildJson.result = null;
				mockRequestBuild.andReturn(createResult({ response: buildJson }));
				mockRequestBuildCompleted.andReturn(createResult({ response: buildJson }));
			});

			it('should signal when started', function () {
				buildJson.building = true;
				build.isRunning = false;

				build.update();

				expect(build.isRunning).toBe(true);
				expect(build.on.started).toHaveBeenDispatchedWith(build);
			});

			it('should signal when finished', function () {
				buildJson.building = false;
				build.isRunning = true;

				build.update();

				expect(build.isRunning).toBe(false);
				expect(build.on.finished).toHaveBeenDispatchedWith(build);
			});

			it('should not signal finished if still stopped', function () {
				buildJson.building = false;
				build.isRunning = false;

				build.update();

				expect(build.isRunning).toBe(false);
				expect(build.on.finished).not.toHaveBeenDispatched();
			});

		});

		it('should get status from last completed build if null', function () {
			buildJson.result = null;
			buildCompletedJson.result = 'FAILURE';

			build.update();

			expect(request.lastCompletedBuild).toHaveBeenCalled();
			expect(build.isBroken).toBe(true);
		});

		describe('error handling', function () {

			it('should signal errorThrown on failure', function () {
				var errorInfo = { httpStatus: 123 };
				mockRequestBuild.andReturn(createResult({ error: errorInfo }));

				build.update();

				expect(build.on.errorThrown).toHaveBeenDispatchedWith(build);
				expect(build.on.broken).not.toHaveBeenDispatched();
				expect(build.on.fixed).not.toHaveBeenDispatched();
				expect(build.on.started).not.toHaveBeenDispatched();
				expect(build.on.finished).not.toHaveBeenDispatched();
			});

			it('should not make second call if first fails', function () {
				var errorInfo = { httpStatus: 123 };
				mockRequestBuild.andReturn(createResult({ error: errorInfo }));

				build.update();

				expect(request.lastCompletedBuild).not.toHaveBeenCalled();
			});
		});

	});

});