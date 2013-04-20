define([
	'services/travis/travisBuild',
	'services/request',
	'rx'
], function (TravisBuild, request, Rx) {

	'use strict';

	describe('services/travis/travisBuild', function () {

		var settings;
		var repoJson;
		var buildJson;

		beforeEach(function () {
			settings = {
				name: 'My Travis CI',
				icon: 'travis/icon.png',
				username: 'AdamNowotny',
				updateInterval: 10000,
				projects: ['AdamNowotny/BuildReactor']
			};
			repoJson = JSON.parse(readFixtures('travis/repository.json'));
			buildJson = JSON.parse(readFixtures('travis/builds_by_number.json'));
		});

		it('should make call on update', function () {
			spyOn(request, 'json').andCallFake(function (options) {
				expect(options.url).toBe('https://api.travis-ci.org/AdamNowotny/BuildReactor');
				return Rx.Observable.never();
			});
			var build = new TravisBuild('AdamNowotny/BuildReactor', settings);

			build.update();

			expect(request.json).toHaveBeenCalled();
		});

		it('should parse response and return current state', function () {
			spyOn(request, 'json').andReturn(Rx.Observable.returnValue(repoJson));
			var build = new TravisBuild('AdamNowotny/BuildReactor', settings);

			build.update().subscribe(function (state) {
				expect(state.id).toBe('AdamNowotny/BuildReactor');
				expect(state.name).toBe('BuildReactor');
				expect(state.group).toBe('AdamNowotny');
				expect(state.webUrl).toBe('https://travis-ci.org/AdamNowotny/BuildReactor/builds/6305554');
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(false);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set isBroken', function () {
			repoJson.last_build_result = 1;
			spyOn(request, 'json').andReturn(Rx.Observable.returnValue(repoJson));
			var build = new TravisBuild('AdamNowotny/BuildReactor', settings);

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(true);
				expect(state.isRunning).toBe(false);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should not set isBroken on successful build', function () {
			repoJson.last_build_result = 0;
			spyOn(request, 'json').andReturn(Rx.Observable.returnValue(repoJson));
			var build = new TravisBuild('AdamNowotny/BuildReactor', settings);

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(false);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should set isRunning', function () {
			repoJson.last_build_started_at = '"2013-04-14T06:04:15Z"';
			repoJson.last_build_finished_at = null;
			spyOn(request, 'json').andReturn(Rx.Observable.returnValue(repoJson));
			var build = new TravisBuild('AdamNowotny/BuildReactor', settings);

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(true);
			});

			expect(request.json).toHaveBeenCalled();
		});

		it('should get result from previous build if null', function () {
			repoJson.last_build_result = null;
			var callCount = 0;
			spyOn(request, 'json').andCallFake(function (options) {
				callCount++;
				if (callCount === 1) {
					return Rx.Observable.returnValue(repoJson);
				} else {
					expect(options.data.number).toBe(repoJson.last_build_number - 1);
					buildJson[0].result = 1;
					return Rx.Observable.returnValue(buildJson);
				}
			});
			var build = new TravisBuild('AdamNowotny/BuildReactor', settings);

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(true);
			});

			expect(request.json).toHaveBeenCalled();
		});

	});

});