define([
	'services/travis/travisBuild',
	'services/request',
	'rx'
], function (TravisBuild, request, Rx) {

	'use strict';

	describe('services/travis/travisBuild', function () {

		var settings;
		var build;
		var buildsResponse;
		var buildsJson, buildsRunningJson;
		var buildDetailsJson, buildDetailsRunningJson;

		beforeEach(function () {
			settings = {
				name: 'My Travis CI',
				icon: 'travis/icon.png',
				username: 'AdamNowotny',
				updateInterval: 10000,
				projects: ['AdamNowotny/BuildReactor']
			};
			buildsJson = JSON.parse(readFixtures('src/services/travis/builds.fixture.json'));
			buildsRunningJson = JSON.parse(readFixtures('src/services/travis/builds_running.fixture.json'));
			buildDetailsJson = JSON.parse(readFixtures('src/services/travis/build_by_id.fixture.json'));
			buildDetailsRunningJson = JSON.parse(readFixtures('src/services/travis/build_by_id_running.fixture.json'));
			buildsResponse = buildsJson;
			spyOn(request, 'json').andCallFake(function (options) {
				switch (options.url) {
				case 'https://api.travis-ci.org/AdamNowotny/BuildReactor/builds':
					return Rx.Observable.returnValue(buildsResponse);
				case 'https://api.travis-ci.org/builds/6305554':
					return Rx.Observable.returnValue(buildDetailsRunningJson);
				case 'https://api.travis-ci.org/builds/6305490':
					return Rx.Observable.returnValue(buildDetailsJson);
				default:
					throw 'Unknown URL ' + options.url;
				}
			});
			build = new TravisBuild('AdamNowotny/BuildReactor', settings);
		});

		it('should parse response and return current state', function () {
			build.update().subscribe(function (state) {
				expect(state.id).toBe('AdamNowotny/BuildReactor');
				expect(state.name).toBe('BuildReactor');
				expect(state.group).toBe('AdamNowotny');
				expect(state.webUrl).toBe('https://travis-ci.org/AdamNowotny/BuildReactor/builds/6305490');
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(false);
			});
		});

		it('should set isBroken', function () {
			buildDetailsJson.result = 1;

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(true);
				expect(state.isRunning).toBe(false);
			});
		});

		it('should not set isBroken on successful build', function () {
			buildDetailsJson.result = 0;

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(false);
			});
		});

		it('should set isRunning', function () {
			buildsResponse = buildsRunningJson;

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(true);
			});
		});

		it('should get result from previous build if null', function () {
			buildsResponse = buildsRunningJson;
			buildDetailsJson.result = 1;

			build.update().subscribe(function (state) {
				expect(state.isBroken).toBe(true);
			});
		});

		it('should set changes', function () {
			build.update().subscribe(function (state) {
				expect(state.changes).toEqual([{ name: 'Adam Nowotny' }]);
			});
		});

		it('should set previous changes if building', function () {
			buildsResponse = buildsRunningJson;

			build.update().subscribe(function (state) {
				expect(state.changes).toEqual([{ name: 'Adam Nowotny' }]);
			});
		});

	});

});