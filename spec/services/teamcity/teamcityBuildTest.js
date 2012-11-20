define([
	'services/teamcity/teamcityBuild',
	'services/teamcity/teamcityRequest',
	'signals',
	'jasmineSignals'
], function (Build, request, Signal, spyOnSignal) {
	'use strict';

	describe('services/teamcity/teamcityBuild', function () {

		var settings;
		var buildJson;
		var mockRequestBuild;
		var mockRequestBuildRunning;

		beforeEach(function () {
			settings = {};
			buildJson = JSON.parse(readFixtures('teamcity/build.json'));
			mockRequestBuild = spyOn(request, 'build').andReturn(createResult({ response: buildJson }));
			mockRequestBuildRunning = spyOn(request, 'buildRunning').andReturn(createResult({ response: {} }));
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
			var build = new Build('build_id', settings);

			build.update();

			expect(request.build).toHaveBeenCalledWith(settings, 'build_id');
		});

		it('should signal when update completed', function () {
			var completed = false;
			mockRequestBuild.andCallFake(function () {
				expect(completed).toBe(false);
				return createResult({ response: buildJson });
			});
			var build = new Build('build_id', settings);

			build.update().addOnce(function () {
				completed = true;
			});

			expect(completed).toBe(true);
		});

		it('should initialize on update', function () {
			var build = new Build('build_id', settings);

			build.update();

			expect(build.name).toBe('Build');
			expect(build.projectName).toBe('Amazon API client');
			expect(build.webUrl).toBe('http://teamcity.jetbrains.com/viewLog.html?buildId=63887&buildTypeId=bt297');
			expect(build.isBroken).toBe(false);
		});

		it('should signal if broken', function () {
			mockRequestBuild.andCallFake(function () {
				buildJson.status = 'FAILURE';
				return createResult({ response: buildJson });
			});
			var build = new Build('build_id', settings);
			spyOnSignal(build.on.broken);

			build.update();

			expect(build.isBroken).toBe(true);
			expect(build.on.broken).toHaveBeenDispatchedWith(build);
		});

		it('should not signal if still broken', function () {
			mockRequestBuild.andCallFake(function () {
				buildJson.status = 'FAILURE';
				return createResult({ response: buildJson });
			});
			var build = new Build('build_id', settings);
			build.isBroken = true;
			spyOnSignal(build.on.broken);

			build.update();

			expect(build.isBroken).toBe(true);
			expect(build.on.broken).not.toHaveBeenDispatched();
		});

		it('should signal if fixed', function () {
			mockRequestBuild.andCallFake(function () {
				buildJson.status = 'SUCCESS';
				return createResult({ response: buildJson });
			});
			var build = new Build('build_id', settings);
			build.isBroken = true;
			spyOnSignal(build.on.fixed);

			build.update();

			expect(build.isBroken).toBe(false);
			expect(build.on.fixed).toHaveBeenDispatchedWith(build);
		});

		it('should not signal fixed if not broken', function () {
			mockRequestBuild.andCallFake(function () {
				buildJson.status = 'SUCCESS';
				return createResult({ response: buildJson });
			});
			var build = new Build('build_id', settings);
			build.isBroken = false;
			spyOnSignal(build.on.fixed);

			build.update();

			expect(build.isBroken).toBe(false);
			expect(build.on.fixed).not.toHaveBeenDispatched();
		});

		it('should signal if started', function () {
			mockRequestBuildRunning.andReturn(createResult({ response: {} }));
			var build = new Build('build_id', settings);
			build.isRunning = false;
			spyOnSignal(build.on.started);

			build.update();

			expect(build.isRunning).toBe(true);
			expect(build.on.started).toHaveBeenDispatchedWith(build);
		});

		it('should signal finished on 404 if running', function () {
			mockRequestBuildRunning.andReturn(createResult({ error: { httpStatus: 404 } }));
			var build = new Build('build_id', settings);
			build.isRunning = true;
			spyOnSignal(build.on.finished);

			build.update();

			expect(build.isRunning).toBe(false);
			expect(build.on.finished).toHaveBeenDispatchedWith(build);
		});

		it('should not signal finished on 404 if not running', function () {
			mockRequestBuildRunning.andReturn(createResult({ error: { httpStatus: 404 } }));
			var build = new Build('build_id', settings);
			build.isRunning = false;
			spyOnSignal(build.on.finished);

			build.update();

			expect(build.isRunning).toBe(false);
			expect(build.on.finished).not.toHaveBeenDispatched();
		});

		it('should not signal finished on other error', function () {
			mockRequestBuildRunning.andReturn(createResult({ error: { httpStatus: 123 } }));
			var build = new Build('build_id', settings);
			build.isRunning = true;
			spyOnSignal(build.on.finished);

			build.update();

			expect(build.isRunning).toBe(true);
			expect(build.on.finished).not.toHaveBeenDispatched();
		});

	});
});