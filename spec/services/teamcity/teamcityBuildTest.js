define([
	'services/teamcity/teamcityBuild',
	'services/request',
	'rx'
], function (Build, request, Rx) {
	'use strict';

	describe('services/teamcity/teamcityBuild', function () {

		var build;
		var settings;
		var buildJson;
		var buildRunningJson;

		beforeEach(function () {
			settings = {
				url: 'http://example.com'
			};
			buildJson = JSON.parse(readFixtures('teamcity/build.json'));
			buildRunningJson = JSON.parse(readFixtures('teamcity/buildRunning.json'));
			var callCount = 0;
			spyOn(request, 'json').andCallFake(function () {
				callCount++;
				switch (callCount) {
				case 1:
					return Rx.Observable.returnValue(buildJson);
				case 2:
					return Rx.Observable.returnValue(buildRunningJson);
				}
			});

			build = new Build('build_id', settings);
		});

		it('should make call on update for guest', function () {
			build.update();

			expect(request.json).toHaveBeenCalled();
			expect(request.json.calls[0].args[0].url).toBe('http://example.com/guestAuth/app/rest/buildTypes/id:build_id/builds/count:1');
			expect(request.json.calls[1].args[0].url).toBe('http://example.com/guestAuth/app/rest/buildTypes/id:build_id/builds/running:any');
		});

		it('should make call on update for user', function () {
			settings.username = 'username';
			settings.password = 'password';

			build.update();

			expect(request.json).toHaveBeenCalled();
			expect(request.json.calls[0].args[0].url).toBe('http://example.com/httpAuth/app/rest/buildTypes/id:build_id/builds/count:1');
			expect(request.json.calls[0].args[0].username).toBe('username');
			expect(request.json.calls[0].args[0].password).toBe('password');
			expect(request.json.calls[1].args[0].url).toBe('http://example.com/httpAuth/app/rest/buildTypes/id:build_id/builds/running:any');
			expect(request.json.calls[1].args[0].username).toBe('username');
			expect(request.json.calls[1].args[0].password).toBe('password');
		});


		it('should parse response and return current state', function () {
			build.update().subscribe(function (state) {
				expect(state.id).toBe('build_id');
				expect(state.name).toBe('Build');
				expect(state.group).toBe('Amazon API client');
				expect(state.webUrl).toBe('http://teamcity.jetbrains.com/viewLog.html?buildId=63887&buildTypeId=bt297');
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(true);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set isBroken', function () {
			buildJson.status = 'FAILURE';

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(true);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should not set isBroken on successful build', function () {
			buildJson.status = 'SUCCESS';

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(false);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set isRunning', function () {
			buildRunningJson.running = true;

			build.update().subscribe(function (state) {
				expect(state.isRunning).toBe(true);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should not set isRunning if it is not', function () {
			buildRunningJson.running = false;

			build.update().subscribe(function (state) {
				expect(state.isRunning).toBe(false);
			});

			expect(request.json).toHaveBeenCalled();
		});

	});
});
