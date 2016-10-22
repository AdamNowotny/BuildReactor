define([
	'core/services/travis/travisBuild',
	'core/services/request',
	'rx',
	'raw!core/services/travis/builds.fixture.json',
	'raw!core/services/travis/builds_running.fixture.json',
	'raw!core/services/travis/build_by_id.fixture.json',
	'raw!core/services/travis/build_by_id_running.fixture.json',
	'test/rxHelpers'
], function(TravisBuild, request, Rx, buildFixture, buildsRunningFixture, buildDetailsFixture, buildDetailsRunningFixture) {

	'use strict';

	describe('core/services/travis/travisBuild', function() {

		var onNext = Rx.ReactiveTest.onNext;
		var settings;
		var build;
		var buildsJson,
			buildsRunningJson,
			buildDetailsJson,
			buildDetailsRunningJson;
		var isRunning;
		var scheduler;

		beforeEach(function() {
			scheduler = new Rx.TestScheduler();
			isRunning = false;
			settings = {
				name: 'My Travis CI',
				icon: 'travis/icon.png',
				username: 'AdamNowotny',
				updateInterval: 10000,
				projects: ['AdamNowotny/BuildReactor']
			};
			buildsJson = JSON.parse(buildFixture);
			buildsRunningJson = JSON.parse(buildsRunningFixture);
			buildDetailsJson = JSON.parse(buildDetailsFixture);
			buildDetailsRunningJson = JSON.parse(buildDetailsRunningFixture);
			spyOn(request, 'json').and.callFake(function(options) {
				switch (options.url) {
				case 'https://api.travis-ci.org/repositories/AdamNowotny/BuildReactor/builds.json':
					return Rx.Observable.returnValue(isRunning ? buildsRunningJson : buildsJson);
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

		it('should parse response and return current state', function() {
			build.update().subscribe(function(state) {
				expect(state.id).toBe('AdamNowotny/BuildReactor');
				expect(state.name).toBe('BuildReactor');
				expect(state.group).toBe('AdamNowotny');
				expect(state.webUrl).toBe('https://travis-ci.org/AdamNowotny/BuildReactor/builds/6305490');
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(false);
			});
		});

		it('should set isBroken if last build broken', function() {
			buildDetailsJson.result = 1;

			build.update().subscribe(function(state) {
				expect(state.isBroken).toBe(true);
				expect(state.isRunning).toBe(false);
			});
		});

		it('should not set isBroken on successful build', function() {
			buildDetailsJson.result = 0;

			build.update().subscribe(function(state) {
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(false);
			});
		});

		it('should set isRunning if build started', function() {
			isRunning = true;

			build.update().subscribe(function(state) {
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(true);
			});
		});

		it('should set isRunning if build created', function() {
			buildsJson[0].state = 'created';
			buildsJson[0].result = null;
			buildDetailsRunningJson.state = 'created';
			buildDetailsRunningJson.result = null;
			isRunning = true;

			build.update().subscribe(function(state) {
				expect(state.isBroken).toBe(false);
				expect(state.isRunning).toBe(true);
			});
		});

		it('should get result from previous build if null', function() {
			isRunning = true;
			buildDetailsJson.result = 1;

			build.update().subscribe(function(state) {
				expect(state.isBroken).toBe(true);
			});
		});

		it('should set changes', function() {
			build.update().subscribe(function(state) {
				expect(state.changes).toEqual([
					{ name: 'Adam Nowotny', message : 'added bower to dependencies' }
				]);
			});
		});

		it('should set previous changes if building', function() {
			isRunning = true;

			build.update().subscribe(function(state) {
				expect(state.changes).toEqual([
					{ name : 'Spun Nakandala', message : 'code for displaying confirm page removed.' }
				]);
			});
		});

		it('should parse errored build', function() {
			buildsJson[0].state = 'finished';
			buildsJson[0].result = null;
			buildDetailsJson.state = 'finished';
			buildDetailsJson.result = null;

			build.update().subscribe(function(state) {
				expect(state.isBroken).toBe(true);
				expect(state.isRunning).toBe(false);
			});
		});

		it('should process builds in right order when previous build results come first', function() {
			var build1Result = new Rx.Subject();
			var build2Result = new Rx.Subject();
			request.json.and.callFake(function(options) {
				switch (options.url) {
				case 'https://api.travis-ci.org/repositories/AdamNowotny/BuildReactor/builds.json':
					return Rx.Observable.returnValue(buildsRunningJson);
				case 'https://api.travis-ci.org/builds/6305554':
					return build1Result;
				case 'https://api.travis-ci.org/builds/6305490':
					return build2Result;
				default:
					throw 'Unknown URL ' + options.url;
				}
			});

			scheduler.scheduleAbsolute(300, function() {
				build2Result.onNext(buildDetailsJson);
				build2Result.onCompleted();
			});
			scheduler.scheduleAbsolute(400, function() {
				build1Result.onNext(buildDetailsRunningJson);
				build1Result.onCompleted();
			});

			var result = scheduler.startWithCreate(function() {
				return build.update();
			});

			expect(result.messages).toHaveElements(onNext(400, {
				webUrl: 'https://travis-ci.org/AdamNowotny/BuildReactor/builds/6305554'
			}));
		});

	});

});
