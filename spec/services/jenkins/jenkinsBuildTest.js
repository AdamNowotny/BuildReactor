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
		var jobJson;
		var buildCompletedJson;
		var mockRequestJob;
		var mockRequestBuildCompleted;

		beforeEach(function () {
			settings = {};
			jobJson = JSON.parse(readFixtures('jenkins/job.json'));
			buildCompletedJson = JSON.parse(readFixtures('jenkins/lastCompletedBuild.json'));
			mockRequestJob = spyOn(request, 'job').andReturn(createResult({ response: jobJson }));
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

			expect(request.job).toHaveBeenCalledWith(settings, 'build_id');
		});

		it('should signal when update completed', function () {
			var completed = false;
			mockRequestJob.andCallFake(function () {
				expect(completed).toBe(false);
				return createResult({ response: jobJson });
			});

			build.update().addOnce(function () {
				completed = true;
			});

			expect(completed).toBe(true);
		});

		it('should know if build disabled', function () {
			jobJson.buildable = false;
			mockRequestJob.andCallFake(function () {
				return createResult({ response: jobJson });
			});

			build.update();

			expect(build.isDisabled).toBe(true);
		});

		it('should initialize on update', function () {
			build.update();

			expect(build.name).toBe('build_id');
			expect(build.projectName).toBe(null);
			expect(build.webUrl).toBe('http://ci.jenkins-ci.org/job/config-provider-model/1354/');
			expect(build.isBroken).toBe(false);
		});

		describe('broken', function () {

			it('should signal on failure', function () {
				buildCompletedJson.result = 'FAILURE';

				build.update();

				expect(build.isBroken).toBe(true);
				expect(build.on.broken).toHaveBeenDispatchedWith(build);
			});

			it('should not signal if still broken', function () {
				buildCompletedJson.result = 'FAILURE';
				build.isBroken = true;

				build.update();

				expect(build.isBroken).toBe(true);
				expect(build.on.broken).not.toHaveBeenDispatched();
			});

			it('should signal if unstable', function () {
				buildCompletedJson.result = 'UNSTABLE';

				build.update();

				expect(build.isBroken).toBe(true);
				expect(build.on.broken).toHaveBeenDispatchedWith(build);
			});

			it('should signal if not build', function () {
				buildCompletedJson.result = 'NOT_BUILT';

				build.update();

				expect(build.isBroken).toBe(true);
				expect(build.on.broken).toHaveBeenDispatchedWith(build);
			});

			it('should signal if aborted', function () {
				buildCompletedJson.result = 'ABORTED';

				build.update();

				expect(build.isBroken).toBe(true);
				expect(build.on.broken).toHaveBeenDispatchedWith(build);
			});

		});

		describe('fixed', function () {

			it('should signal when fixed', function () {
				buildCompletedJson.result = 'SUCCESS';
				build.isBroken = true;

				build.update();

				expect(build.isBroken).toBe(false);
				expect(build.on.fixed).toHaveBeenDispatchedWith(build);
			});

			it('should not signal fixed if not broken', function () {
				buildCompletedJson.result = 'SUCCESS';
				build.isBroken = false;

				build.update();

				expect(build.isBroken).toBe(false);
				expect(build.on.fixed).not.toHaveBeenDispatched();
			});

		});

		describe('running', function () {

			beforeEach(function () {
				mockRequestJob.andReturn(createResult({ response: jobJson }));
				mockRequestBuildCompleted.andReturn(createResult({ response: buildCompletedJson }));
			});

			it('should signal when started', function () {
				jobJson.lastBuild.number = 100;
				jobJson.lastCompletedBuild.number = 99;
				build.isRunning = false;

				build.update();

				expect(build.isRunning).toBe(true);
				expect(build.on.started).toHaveBeenDispatchedWith(build);
			});

			it('should not signal started if disabled', function () {
				jobJson.lastBuild.number = 100;
				jobJson.lastCompletedBuild.number = 99;
				jobJson.buildable = false;
				build.isRunning = false;

				build.update();

				expect(build.isRunning).toBe(true);
				expect(build.on.started).not.toHaveBeenDispatchedWith(build);
			});

			it('should signal when finished', function () {
				jobJson.lastBuild.number = 100;
				jobJson.lastCompletedBuild.number = 100;
				build.isRunning = true;

				build.update();

				expect(build.isRunning).toBe(false);
				expect(build.on.finished).toHaveBeenDispatchedWith(build);
			});

			it('should not signal finished when disabled', function () {
				jobJson.lastBuild.number = 100;
				jobJson.lastCompletedBuild.number = 100;
				jobJson.buildable = false;
				build.isRunning = true;

				build.update();

				expect(build.isRunning).toBe(false);
				expect(build.on.finished).not.toHaveBeenDispatchedWith(build);
			});

			it('should not signal finished if still stopped', function () {
				jobJson.lastBuild.number = 100;
				jobJson.lastCompletedBuild.number = 100;
				build.isRunning = false;

				build.update();

				expect(build.isRunning).toBe(false);
				expect(build.on.finished).not.toHaveBeenDispatched();
			});

		});

		describe('error handling', function () {

			it('should signal errorThrown on failure', function () {
				var errorInfo = { httpStatus: 123 };
				mockRequestJob.andReturn(createResult({ error: errorInfo }));

				build.update();

				expect(build.on.errorThrown).toHaveBeenDispatchedWith(build);
				expect(build.on.broken).not.toHaveBeenDispatched();
				expect(build.on.fixed).not.toHaveBeenDispatched();
				expect(build.on.started).not.toHaveBeenDispatched();
				expect(build.on.finished).not.toHaveBeenDispatched();
			});

			it('should not make second call if first fails', function () {
				var errorInfo = { httpStatus: 123 };
				mockRequestJob.andReturn(createResult({ error: errorInfo }));

				build.update();

				expect(request.lastCompletedBuild).not.toHaveBeenCalled();
			});
		});

	});

});